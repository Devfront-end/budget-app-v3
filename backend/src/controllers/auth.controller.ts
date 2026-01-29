import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';
import { EmailService } from '../services/email.service';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, username, password, firstName, lastName } = req.body;

      // Check if user exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: 'Email or username already exists',
          },
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(
        password,
        parseInt(process.env.BCRYPT_ROUNDS || '12', 10)
      );

      // Generate Email Verify Token
      const emailVerifyToken = crypto.randomBytes(32).toString('hex');

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          firstName,
          lastName,
          emailVerifyToken,
          isEmailVerified: false,
        },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          createdAt: true,
        },
      });

      // Create default categories for the new user
      const defaultCategories = [
        { name: 'Alimentation', icon: '🛒', color: '#10B981', type: 'EXPENSE' },
        { name: 'Transport', icon: '🚗', color: '#3B82F6', type: 'EXPENSE' },
        { name: 'Loisirs', icon: '🎬', color: '#8B5CF6', type: 'EXPENSE' },
        { name: 'Restaurant', icon: '🍽️', color: '#F59E0B', type: 'EXPENSE' },
        { name: 'Shopping', icon: '🛍️', color: '#EC4899', type: 'EXPENSE' },
        { name: 'Santé', icon: '🏥', color: '#EF4444', type: 'EXPENSE' },
        { name: 'Salaire', icon: '💰', color: '#10B981', type: 'INCOME' },
        { name: 'Freelance', icon: '💼', color: '#3B82F6', type: 'INCOME' },
      ];

      await Promise.all(
        defaultCategories.map((cat: any) =>
          prisma.category.create({
            data: {
              userId: user.id,
              ...cat,
            },
          })
        )
      );

      // Send Verification Email
      await EmailService.sendVerificationEmail(email, emailVerifyToken);

      res.status(201).json({
        success: true,
        data: { user },
        message: 'User registered. Please check your email to verify account.',
      });
    } catch (error: any) {
      console.error('DEBUG REGISTRATION ERROR:', error);
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'REGISTRATION_ERROR',
          message: 'Failed to register user',
        },
      });
    }
  }

  static async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.query;

      if (!token || typeof token !== 'string') {
        return res.status(400).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Token required' } });
      }

      const user = await prisma.user.findFirst({
        where: { emailVerifyToken: token },
      });

      if (!user) {
        return res.status(400).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' } });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          isEmailVerified: true,
          emailVerifyToken: null
        },
      });

      res.json({ success: true, message: 'Email verified successfully. You can now login.' });
    } catch (error) {
      res.status(500).json({ success: false, error: { code: 'VERIFICATION_ERROR', message: 'Failed to verify email' } });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password, totpToken } = req.body;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Generic error to avoid enumeration
        return res.status(401).json({
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' },
        });
      }

      // Check Email Verification
      if (!user.isEmailVerified) {
        return res.status(403).json({
          success: false,
          error: { code: 'EMAIL_NOT_VERIFIED', message: 'Please verify your email first.' }
        });
      }

      // Check lockout
      if (user.lockoutUntil && user.lockoutUntil > new Date()) {
        return res.status(423).json({
          success: false,
          error: {
            code: 'ACCOUNT_LOCKED',
            message: 'Account is temporarily locked. Please try again later.',
          },
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        // Increment failed attempts
        const attempts = user.failedLoginAttempts + 1;
        const lockout = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;

        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: attempts,
            lockoutUntil: lockout
          }
        });

        return res.status(401).json({
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' },
        });
      }

      // 2FA Check
      if (user.twoFactorEnabled) {
        if (!totpToken) {
          return res.status(401).json({
            success: false,
            requires2FA: true,
            message: '2FA code required'
          });
        }

        // Verify TOTP
        const verified = speakeasy.totp.verify({
          secret: user.twoFactorSecret!, // twoFactorSecret is guaranteed to exist if twoFactorEnabled is true
          encoding: 'base32',
          token: totpToken
        });

        if (!verified) {
          return res.status(401).json({ success: false, error: { code: 'INVALID_2FA', message: 'Invalid 2FA code' } });
        }
      }

      // Success: Reset lockout and issue tokens
      // 1. Reset attempts
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 0,
          lockoutUntil: null,
          lastLogin: new Date()
        }
      });

      // 2. Access Token (15m)
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '15m' }
      );

      // 3. Refresh Token (7d)
      const refreshToken = crypto.randomBytes(40).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await prisma.refreshToken.create({
        data: {
          token: refreshToken, // In production, hash this before storing!
          userId: user.id,
          expiresAt
        }
      });

      // 4. Set Cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      logger.info(`User logged in: ${email}`);

      res.json({
        success: true,
        data: {
          token: accessToken,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            twoFactorEnabled: user.twoFactorEnabled
          },
        },
      });
    } catch (error: any) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'LOGIN_ERROR', message: 'Failed to login' },
      });
    }
  }

  static async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { revoked: true }
      });
    }

    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully' });
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ success: false, error: { code: 'NO_TOKEN', message: 'No refresh token' } });
      }

      const tokenRecord = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true }
      });

      if (!tokenRecord || tokenRecord.revoked || tokenRecord.expiresAt < new Date()) {
        res.clearCookie('refreshToken');
        return res.status(403).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid token' } });
      }

      // Rotate token (new Access + new Refresh)
      // Revoke old
      await prisma.refreshToken.update({
        where: { id: tokenRecord.id },
        data: { revoked: true }
      });

      // New Access
      const newAccessToken = jwt.sign(
        { userId: tokenRecord.userId, email: tokenRecord.user.email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '15m' }
      );

      // New Refresh
      const newRefreshToken = crypto.randomBytes(40).toString('hex');
      await prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: tokenRecord.userId,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      });

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({ success: true, data: { token: newAccessToken } });

    } catch (error) {
      res.status(500).json({ success: false, error: { code: 'REFRESH_ERROR', message: 'Failed to refresh' } });
    }
  }

  static async enable2FA(req: Request, res: Response) {
    try {
      const user = (req as any).user; // Assuming user is attached by an auth middleware
      if (!user) return res.sendStatus(401);

      const secret = speakeasy.generateSecret({ name: `SmartBudget (${user.email})` });

      // Save secret to the user record, but keep twoFactorEnabled as false until verified
      await prisma.user.update({
        where: { id: user.id },
        data: { twoFactorSecret: secret.base32 }
      });

      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

      res.json({
        success: true,
        data: {
          secret: secret.base32,
          qrCode: qrCodeUrl
        }
      });
    } catch (error) {
      logger.error('Enable 2FA error:', error);
      res.status(500).json({ success: false, error: { code: '2FA_SETUP_ERROR', message: 'Failed to setup 2FA' } });
    }
  }

  static async verify2FA(req: Request, res: Response) {
    try {
      const user = (req as any).user; // Assuming user is attached by an auth middleware
      const { token } = req.body;
      if (!user) return res.sendStatus(401);

      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (!dbUser || !dbUser.twoFactorSecret) {
        return res.status(400).json({ success: false, error: { code: 'NO_SECRET', message: '2FA setup not initiated or secret missing' } });
      }

      const verified = speakeasy.totp.verify({
        secret: dbUser.twoFactorSecret,
        encoding: 'base32',
        token
      });

      if (!verified) {
        return res.status(401).json({ success: false, error: { code: 'INVALID_2FA_CODE', message: 'Invalid 2FA code' } });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { twoFactorEnabled: true }
      });

      res.json({ success: true, message: '2FA enabled successfully' });
    } catch (error) {
      logger.error('Verify 2FA error:', error);
      res.status(500).json({ success: false, error: { code: '2FA_VERIFY_ERROR', message: 'Failed to verify 2FA' } });
    }
  }

  static async disable2FA(req: Request, res: Response) {
    try {
      const user = (req as any).user; // Assuming user is attached by an auth middleware
      if (!user) return res.sendStatus(401);

      await prisma.user.update({
        where: { id: user.id },
        data: { twoFactorEnabled: false, twoFactorSecret: null }
      });

      res.json({ success: true, message: '2FA disabled successfully' });
    } catch (error) {
      logger.error('Disable 2FA error:', error);
      res.status(500).json({ success: false, error: { code: '2FA_DISABLE_ERROR', message: 'Failed to disable 2FA' } });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      // Check if user exists
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        // Return success even if user not found to prevent enumeration
        // But maybe delay a bit to match timing?
        return res.json({ success: true, message: 'If this email exists, a reset link has been sent.' });
      }

      // Generate Reset Token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Save to user
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      // Send Email
      await EmailService.sendPasswordResetEmail(email, resetToken);

      res.json({ success: true, message: 'If this email exists, a reset link has been sent.' });
    } catch (error) {
      logger.error('Forgot password error:', error);
      res.status(500).json({ success: false, error: { code: 'RESET_REQUEST_ERROR', message: 'Failed to process request' } });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ success: false, error: { code: 'INVALID_DATA', message: 'Token and password required' } });
      }

      // Find user by token and check expiry
      const user = await prisma.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpiry: { gt: new Date() },
        },
      });

      if (!user) {
        return res.status(400).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid or expired reset token' } });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(
        newPassword,
        parseInt(process.env.BCRYPT_ROUNDS || '12', 10)
      );

      // Update user and clear token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      res.json({ success: true, message: 'Password reset successfully. You can now login.' });
    } catch (error) {
      logger.error('Reset password error:', error);
      res.status(500).json({ success: false, error: { code: 'RESET_ERROR', message: 'Failed to reset password' } });
    }
  }
}


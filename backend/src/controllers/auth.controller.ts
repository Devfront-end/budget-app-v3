import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, username, password, firstName, lastName } = req.body;

      // Validate input
      if (!email || !username || !password) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Email, username, and password are required',
          },
        });
      }

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

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          firstName,
          lastName,
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

      logger.info(`New user registered: ${email}`);

      res.status(201).json({
        success: true,
        data: { user },
        message: 'User registered successfully',
      });
    } catch (error: any) {
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

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Email and password are required',
          },
        });
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        });
      }

      // Check if account is active
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCOUNT_DISABLED',
            message: 'Your account has been disabled',
          },
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'secret'
      );

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      logger.info(`User logged in: ${email}`);

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        },
      });
    } catch (error: any) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'LOGIN_ERROR',
          message: 'Failed to login',
        },
      });
    }
  }

  static async logout(req: Request, res: Response) {
    // In a JWT-based system, logout is handled client-side
    // For enhanced security, you could implement token blacklisting with Redis
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  }

  static async refreshToken(req: Request, res: Response) {
    // TODO: Implement refresh token logic
    res.status(501).json({
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Refresh token not implemented yet',
      },
    });
  }

  static async forgotPassword(req: Request, res: Response) {
    // TODO: Implement forgot password logic
    res.status(501).json({
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Forgot password not implemented yet',
      },
    });
  }

  static async resetPassword(req: Request, res: Response) {
    // TODO: Implement reset password logic
    res.status(501).json({
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Reset password not implemented yet',
      },
    });
  }

  static async verifyEmail(req: Request, res: Response) {
    // TODO: Implement email verification logic
    res.status(501).json({
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Email verification not implemented yet',
      },
    });
  }
}

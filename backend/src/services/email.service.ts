import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

export class EmailService {
    private static transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    static async sendPasswordResetEmail(to: string, resetToken: string) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

        // If no real SMTP credentials, log to console for dev/testing
        if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your_smtp_user') {
            console.log('=================================================================');
            console.log(`📧 [MOCK EMAIL] To: ${to}`);
            console.log(`🔗 Link: ${resetLink}`);
            console.log('=================================================================');
            logger.info(`[MOCK EMAIL] Password reset link for ${to}: ${resetLink}`);
            return;
        }

        try {
            await this.transporter.sendMail({
                from: '"Smart Budget" <noreply@smartbudget.com>',
                to,
                subject: 'Reset your password',
                html: `
          <h1>Reset Password</h1>
          <p>You requested to reset your password. Click the link below to proceed:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>This link expires in 1 hour.</p>
          <p>If you didn't request this, ignore this email.</p>
        `,
            });
            logger.info(`Password reset email sent to ${to}`);
        } catch (error) {
            logger.error('Failed to send password reset email:', error);
            // Fallback log even on error if it's likely a config issue in dev
            if (process.env.NODE_ENV !== 'production') {
                logger.info(`[FALLBACK] Reset link for ${to}: ${resetLink}`);
            }
            throw new Error('Could not send email');
        }
    }

    static async sendVerificationEmail(to: string, token: string) {
        const apiUrl = process.env.API_URL || 'http://localhost:3000/api/v1';
        // Note: The original code used a backend link for verification, usually verification links point to a frontend page which then calls the API, 
        // or a backend endpoint that redirects. The original controller mock message showed: /api/v1/auth/verify-email?token=...
        // Let's assume the backend endpoint handles the verification and response/redirect.
        const verificationLink = `${apiUrl}/auth/verify-email?token=${token}`;

        if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your_smtp_user') {
            console.log('=================================================================');
            console.log(`📧 [MOCK EMAIL] Verification for: ${to}`);
            console.log(`🔗 Link: ${verificationLink}`);
            console.log('=================================================================');
            logger.info(`[MOCK EMAIL] Verification link for ${to}: ${verificationLink}`);
            return;
        }

        try {
            await this.transporter.sendMail({
                from: '"Smart Budget" <noreply@smartbudget.com>',
                to,
                subject: 'Verify Your Account',
                html: `
            <h1>Welcome to Smart Budget!</h1>
            <p>Please verify your account by clicking the link below:</p>
            <a href="${verificationLink}">Verify Account</a>
            <p>If you didn't create this account, ignore this email.</p>
          `,
            });
            logger.info(`Verification email sent to ${to}`);
        } catch (error) {
            logger.error('Failed to send verification email:', error);
            if (process.env.NODE_ENV !== 'production') {
                logger.info(`[FALLBACK] Verification link for ${to}: ${verificationLink}`);
            }
            // Don't throw here to avoid blocking registration flow if email fails (optional choice)
            // throw new Error('Could not send email');
        }
    }
}

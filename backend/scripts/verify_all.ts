// @ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyAll() {
    try {
        // Verify all users who are not verified
        const result = await prisma.user.updateMany({
            where: { isEmailVerified: false },
            data: {
                isEmailVerified: true,
                emailVerifyToken: null
            }
        });
        console.log(`Successfully verified ${result.count} users.`);
    } catch (error) {
        console.error('Error verifying users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyAll();

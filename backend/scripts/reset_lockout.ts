// @ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetLockout() {
    try {
        const result = await prisma.user.updateMany({
            where: { failedLoginAttempts: { gt: 0 } },
            data: {
                failedLoginAttempts: 0,
                lockoutUntil: null
            }
        });
        console.log(`Reset lockout for ${result.count} users.`);
    } catch (error) {
        console.error('Error resetting lockout:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetLockout();

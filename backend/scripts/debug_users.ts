import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            username: true,
            isEmailVerified: true,
            failedLoginAttempts: true,
            lockoutUntil: true,
            twoFactorEnabled: true,
            createdAt: true
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 5
    });

    console.log('Most recent users:');
    console.table(users);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

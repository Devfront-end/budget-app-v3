import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                lastLogin: true,
                isActive: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log(`Found ${users.length} users:`);
        console.table(users);
    } catch (e) {
        console.error('Error listing users:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();

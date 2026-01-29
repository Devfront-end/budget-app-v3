import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const update = await prisma.user.updateMany({
        data: {
            isEmailVerified: true,
            emailVerifyToken: null
        }
    });

    console.log(`Verified ${update.count} users.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

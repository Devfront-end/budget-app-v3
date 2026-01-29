
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        // 1. Get or Create a user
        let user = await prisma.user.findFirst();
        if (!user) {
            console.log('No user found. Creating test user...');
            user = await prisma.user.create({
                data: {
                    email: 'test@example.com',
                    username: 'testuser',
                    password: 'hashedpassword', // In a real app this should be hashed
                    isActive: true
                }
            });
            console.log('Test user created.');
        }
        console.log(`Testing with user: ${user.email} (${user.id})`);

        // 2. Simulate getAll
        // Matches CategoryController.getAll logic
        const categories = await prisma.category.findMany({
            where: { userId: user.id },
            orderBy: { name: 'asc' },
        });

        console.log('Categories fetch result:', JSON.stringify(categories, null, 2));

        if (categories.length === 0) {
            console.log('No categories. Attempting to seed defaults...');
            const defaultCategories = [
                { name: 'Alimentation', icon: '🛒', color: '#10B981', type: 'EXPENSE' },
                { name: 'Transport', icon: '🚗', color: '#3B82F6', type: 'EXPENSE' },
                // ... partial list
            ];

            await prisma.category.createMany({
                data: defaultCategories.map((cat) => ({
                    userId: user!.id,
                    ...cat,
                    type: cat.type as any,
                })),
                skipDuplicates: true,
            });
            console.log('Defaults seeded.');

            const seededCategories = await prisma.category.findMany({
                where: { userId: user.id },
                orderBy: { name: 'asc' },
            });
            console.log('Refetched categories:', JSON.stringify(seededCategories, null, 2));
        }

    } catch (e) {
        console.error('Error during reproduction:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();

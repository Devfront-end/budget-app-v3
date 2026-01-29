
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    try {
        const email = 'test@example.com';
        const password = 'Password123!';

        console.log(`Fixing user: ${email}`);

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            console.log('User not found. Creating...');
            const hashedPassword = await bcrypt.hash(password, 12);
            await prisma.user.create({
                data: {
                    email,
                    username: 'testuser_fixed',
                    password: hashedPassword,
                    isActive: true,
                    isEmailVerified: true
                }
            });
            console.log('User created with verified email and valid password.');
        } else {
            console.log('User found. Updating...');
            const hashedPassword = await bcrypt.hash(password, 12);
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                    isEmailVerified: true,
                    isActive: true,
                    lockoutUntil: null,
                    failedLoginAttempts: 0
                }
            });
            console.log('User updated with verified email and valid password.');
        }

    } catch (e) {
        console.error('Error fixing user:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();

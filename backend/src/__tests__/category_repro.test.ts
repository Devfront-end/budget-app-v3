import request from 'supertest';
import { prisma } from '../config/database';

const API_URL = 'http://localhost:3000';

describe('Category API Reproduction (Live)', () => {
    let token: string;
    let userId: string;
    const testEmail = `cat-repro-${Date.now()}@example.com`;

    beforeAll(async () => {
        try {
            // Clean up potentially old test users
            // await prisma.user.deleteMany({ where: { email: { startsWith: 'cat-repro-' } } });

            // Register user
            console.log('Attempting to register user...');
            const res = await request(API_URL).post('/api/v1/auth/register').send({
                email: testEmail,
                password: 'Password123!',
                username: `catrepro${Date.now()}`,
            });
            console.log('Register response:', res.status, JSON.stringify(res.body));

            if (res.status !== 201) {
                throw new Error('Failed to register: ' + JSON.stringify(res.body));
            }

            userId = res.body.data.user.id;
            console.log('User registered with ID:', userId);

            // Manually verify email in DB so we can login
            await prisma.user.update({
                where: { id: userId },
                data: { isEmailVerified: true }
            });
            console.log('User email verified');

            // Login
            console.log('Attempting login...');
            const loginRes = await request(API_URL).post('/api/v1/auth/login').send({
                email: testEmail,
                password: 'Password123!'
            });
            console.log('Login response status:', loginRes.status);

            token = loginRes.body.data.token;
            console.log('Login token:', token ? 'GOT TOKEN' : 'NO TOKEN');
        } catch (error) {
            console.error('ERROR IN BEFOREALL:', error);
            throw error;
        }
    });

    afterAll(async () => {
        if (userId) {
            await prisma.user.delete({ where: { id: userId } }).catch(e => console.error(e));
        }
        await prisma.$disconnect();
    });

    it('should initialize default categories and fetch them', async () => {
        // 1. Check initial categories (register should create them)
        let res = await request(API_URL)
            .get('/api/v1/categories')
            .set('Authorization', `Bearer ${token}`);

        console.log('Initial categories response:', res.status, res.body.data?.categories?.length);
        expect(res.status).toBe(200);
        // Should be > 0

        // 2. Delete all categories for this user directly in DB to simulate "empty" state
        await prisma.category.deleteMany({ where: { userId } });

        res = await request(API_URL)
            .get('/api/v1/categories')
            .set('Authorization', `Bearer ${token}`);
        expect(res.body.data.categories.length).toBe(0);

        // 3. Call init-defaults
        res = await request(API_URL)
            .post('/api/v1/categories/init-defaults')
            .set('Authorization', `Bearer ${token}`)
            .send({});

        console.log('Init defaults response:', res.status, res.body);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.categories.length).toBeGreaterThan(0);
    });
});

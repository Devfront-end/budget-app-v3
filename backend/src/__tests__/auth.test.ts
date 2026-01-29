import request from 'supertest';
import app from '../app';
import { prisma } from '../config/database';

describe('Auth API', () => {
    beforeAll(async () => {
        // Cleanup database before tests
        await prisma.transaction.deleteMany();
        await prisma.bankAccount.deleteMany();
        await prisma.category.deleteMany();
        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    const testUser = {
        email: 'test-api@example.com',
        username: 'testapiuser',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'Api'
    };

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send(testUser);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.user.email).toBe(testUser.email);
    });

    it('should not register duplicate user', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send(testUser);

        expect(res.status).toBe(409);
        expect(res.body.success).toBe(false);
    });

    it('should login with valid credentials', async () => {
        // Manually verify user to allow login
        await prisma.user.update({
            where: { email: testUser.email },
            data: { isEmailVerified: true }
        });

        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.token).toBeDefined();
    });

    it('should not login with invalid password', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: testUser.email,
                password: 'wrongpassword'
            });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });
});

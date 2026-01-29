import request from 'supertest';
import app from '../app';
import { prisma } from '../config/database';

describe('Transaction API', () => {
    let token: string;
    let userId: string;
    let categoryId: string;
    let bankAccountId: string;

    const testUser = {
        email: 'trans-test@example.com',
        username: 'transtest',
        password: 'Password123!',
        firstName: 'Trans',
        lastName: 'Test'
    };

    beforeAll(async () => {
        // Cleanup
        await prisma.transaction.deleteMany();
        await prisma.bankAccount.deleteMany();
        await prisma.category.deleteMany();
        await prisma.user.deleteMany();

        // Register User
        const registerRes = await request(app)
            .post('/api/v1/auth/register')
            .send(testUser);

        userId = registerRes.body.data.user.id;

        // Verify User for Login
        await prisma.user.update({
            where: { id: userId },
            data: { isEmailVerified: true }
        });

        // Login
        const loginRes = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        token = loginRes.body.data.token;

        // Create Category
        const catRes = await request(app)
            .post('/api/v1/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test Cat',
                type: 'EXPENSE',
                icon: '🛒',
                color: '#000000'
            });
        categoryId = catRes.body.data.category.id;

        // Create Bank Account
        const accRes = await request(app)
            .post('/api/v1/bank-accounts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Main Account',
                type: 'CHECKING',
                bankName: 'Test Bank',
                balance: 1000
            });
        bankAccountId = accRes.body.data.account.id;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should create a transaction linked to category and account', async () => {
        const res = await request(app)
            .post('/api/v1/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send({
                amount: 50.00,
                type: 'EXPENSE',
                description: 'Groceries',
                categoryId: categoryId,
                bankAccountId: bankAccountId,
                date: new Date().toISOString()
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.transaction.amount).toBe("50");
        expect(res.body.data.transaction.categoryId).toBe(categoryId);
    });

    it('should fetch transactions', async () => {
        const res = await request(app)
            .get('/api/v1/transactions')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.data.transactions).toHaveLength(1);
        expect(res.body.data.transactions[0].description).toBe('Groceries');
    });

    it('should update a transaction', async () => {
        // First get the transaction
        const getRes = await request(app)
            .get('/api/v1/transactions')
            .set('Authorization', `Bearer ${token}`);

        const txId = getRes.body.data.transactions[0].id;

        const res = await request(app)
            .put(`/api/v1/transactions/${txId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                amount: 75.00
            });

        expect(res.status).toBe(200);
        expect(res.body.data.transaction.amount).toBe("75");
    });

    it('should delete a transaction', async () => {
        // Get One
        const getRes = await request(app)
            .get('/api/v1/transactions')
            .set('Authorization', `Bearer ${token}`);

        const txId = getRes.body.data.transactions[0].id;

        const res = await request(app)
            .delete(`/api/v1/transactions/${txId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);

        // Verify gone
        const checkRes = await request(app)
            .get(`/api/v1/transactions/${txId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(checkRes.status).toBe(404);
    });
});

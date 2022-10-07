const app = require('../src/app')
const request = require('supertest');
const { seed } = require('../scripts/seedDb');

describe('/contracts/:id ', () => {
    it('should return contract with ID 1', async () => {
        const contract = {
            "id": 1,
            "terms": "bla bla bla",
            "status": "terminated",
            "ContractorId": 5,
            "ClientId": 1
        }
        const response = await request(app).get("/contracts/1").set({ profile_id: 1 });
        expect(response.status).toBe(200)
        expect(JSON.parse(response.text)).toEqual(expect.objectContaining(contract))
    });

    it('should fail because user doens\'t exist', async () => {
        const response = await request(app).get("/contracts/1").set({ profile_id: 999 });
        expect(response.status).toBe(401)
    });

    it('should fail because of wrong user', async () => {
        const response = await request(app).get("/contracts/1").set({ profile_id: 2 });
        expect(response.status).toBe(404)
    });

    it('should fail because contract doesn\'t exists', async () => {
        const response = await request(app).get("/contracts/999").set({ profile_id: 2 });
        expect(response.status).toBe(404)
    });

});

describe('/contracts ', () => {
    it('should return all contracts for user with ID 1', async () => {
        const response = await request(app).get("/contracts").set({ profile_id: 1 });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                "ClientId": 1,
                "ContractorId": 6,
                "id": 2,
                "status": "in_progress",
                "terms": "bla bla bla",
            })
        ]))
    });
    it('should fail because user doens\'t exist', async () => {
        const response = await request(app)
            .get('/contracts')
            .set({ profile_id: 99 })
        expect(response.status).toBe(401);
    });
});

describe('/jobs/unpaid ', () => {
    const route = '/jobs/unpaid'
    it('should return all unpaid jobs for user with ID 1', async () => {
        const response = await request(app)
            .get(route)
            .set({ profile_id: 2 })
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: 4,
                description: 'work',
                price: 200,
                paid: null,
                paymentDate: null,
                ContractId: 4,
                Contract: expect.objectContaining({
                    id: 4,
                    terms: 'bla bla bla',
                    status: 'in_progress',
                    ContractorId: 7,
                    ClientId: 2
                })
            })
        ]))
    });
    it('should fail because of unexistant user', async () => {
        const response = await request(app)
            .get(route)
            .set({ profile_id: 99 })
        expect(response.status).toBe(401);
    });
});

describe('/jobs/:job_id/pay ', () => {

    beforeAll(async () => {
        await seed()
    });

    it('should pay job with ID 2', async () => {
        const response = await request(app)
            .post('/jobs/2/pay')
            .set({ profile_id: 1 })
        expect(response.status).toBe(200);
        expect(response.text).toBe(`Job 2 has been paid`);
    });

    it('should fail because user is not a client', async () => {
        const response = await request(app)
            .post('/jobs/2/pay')
            .set({ profile_id: 5 })
        expect(response.status).toBe(500);
        expect(response.text).toBe(`The user is not a client`);
    });

    it('should fail because client\' balance is less than job price', async () => {
        const response = await request(app)
            .post('/jobs/5/pay')
            .set({ profile_id: 4 })
        expect(response.status).toBe(500);
        expect(response.text).toBe(`Client doesn't have enough balance`);
    });

    it('should fail for wrong user', async () => {
       const response = await request(app)
            .post('/jobs/2/pay')
            .set({ profile_id: 2 })
        expect(response.status).toBe(404);
        expect(response.text).toBe(`Job not found`);
    });

    it('should fail for unexistant profile', async () => {
        const response = await request(app)
            .post('/jobs/2/pay')
            .set({ profile_id: 99 })
        expect(response.status).toBe(401);
    });
});

describe('/balances/deposit/:userId', () => {
    
    beforeAll(async () => {
        await seed()
    });

    it('should deposit 1 dolar into user with ID 2', async () => {
        const response = await request(app)
            .post('/balances/deposit/2')
            .set({ profile_id: 2 })
            .query({ amount: 1 })
        expect(response.status).toBe(200);
        expect(response.text).toBe('{"old_balance":231.11,"new_balance":232.11}') 
    });

    it('should say client has paid all his jobs ', async () => {
        const response = await request(app)
            .post('/balances/deposit/3')
            .set({ profile_id: 3 })
            .query({ amount: 1 })
        expect(response.status).toBe(200);
        expect(response.text).toBe('Client has paid all his jobs')
    });

    it('should fail for user is not a client', async () => {
        const response = await request(app)
            .post('/balances/deposit/8')
            .set({ profile_id: 8 })
            .query({ amount: 1 })
        expect(response.status).toBe(400);
        expect(response.text).toBe('User is not a client')
    });

    it('should fail for large amount', async () => {
        const response = await request(app)
            .post('/balances/deposit/2')
            .set({ profile_id: 2 })
            .query({ amount: 10000 })
        expect(response.status).toBe(400);
        expect(response.text).toBe('You cannot deposit more than 25% of your total jobs to pay')
    });

    it('should fail for invalid amount', async () => {
        const response = await request(app)
            .post('/balances/deposit/2')
            .set({ profile_id: 2 })
            .query({ amount: 'invalid' })
        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid amount')
    });

    it('should fail for Incorrect user id', async () => {
        const response = await request(app)
            .post('/balances/deposit/2')
            .set({ profile_id: 1 })
            .query({ amount: 1 })
        expect(response.status).toBe(400);
        expect(response.text).toBe('Incorrect user id')
    });
});

describe('/admin/best-profession', () => {
    it('should return Programmer', async () => {
        const response = await request(app)
            .get('/admin/best-profession')
            .query({ start: '2020-01-01', end: '2020-12-31' })
        expect(response.status).toBe(200);
        expect(response.text).toBe('Programmer')
    });

    it('should fail for wrong start date', async () => {
        const response = await request(app)
            .get('/admin/best-profession')
            .query({ start: 'wrong', end: '2020-12-31' })
        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid date');
    });

    it('should fail for wrong end date', async () => {
        const response = await request(app)
            .get('/admin/best-profession')
            .query({ start: '2020-01-01', end: 'wrong' })
        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid date');
    });
});

describe('/admin/best-clients', () => {

    it('should return best clients', async () => {
        const response = await request(app)
            .get('/admin/best-clients')
            .query({ start: '2020-01-01', end: '2020-12-31' })
        expect(response.status).toBe(200);
        expect(JSON.parse(response.text)).toEqual([
            { fullName: 'Ash Kethcum', id: 4, paid: 2020 },
            { fullName: 'Mr Robot', id: 2, paid: 442 }
        ])
    });

    it('should return only first best client', async () => {
        const response = await request(app)
            .get('/admin/best-clients')
            .query({ start: '2020-01-01', end: '2020-12-31',  limit: 1 })
        expect(response.status).toBe(200);
        expect(JSON.parse(response.text)).toEqual([
            { fullName: 'Ash Kethcum', id: 4, paid: 2020 }
        ])
    });

    it('should fail for wrong start date', async () => {
        const response = await request(app)
            .get('/admin/best-clients')
            .query({ start: 'wrong', end: '2020-12-31',})
        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid date');
    });

    it('should fail for wrong end date', async () => {
        const response = await request(app)
            .get('/admin/best-clients')
            .query({ start: '2020-12-31', end: 'wrong', })
        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid date');
    });
});
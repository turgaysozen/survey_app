const test = require('ava');
const request = require('supertest');
const app = require('../../server');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const chance = require('chance');

let server;

test.before(async () => {
    server = app.listen();
});

test.after(async () => {
    await server.close();
});

let token = null;
let adminToken = null;
const random = new chance();

test.beforeEach(async t => {
    const email = random.email();
    const password = random.string();
    const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
            firstName: 'John',
            lastName: 'Doe',
            email: email,
            role: 'User',
            password: password
        });
    t.is(registerResponse.status, 200);
    t.truthy(registerResponse.body.token);

    const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: email, password: password });

    token = loginResponse.body.token

    const adminEmail = random.email();
    const registerAdminResponse = await request(app)
        .post('/api/auth/register')
        .send({
            firstName: 'Admin',
            lastName: 'admin',
            email: adminEmail,
            role: 'Admin',
            password: password
        });
    t.is(registerAdminResponse.status, 200);
    t.truthy(registerAdminResponse.body.token);
    adminToken = registerAdminResponse.body.token;
});

test('Create a form', async (t) => {
    const label = 'Test Form';
    const res = await request(app)
        .post('/api/form/create')
        .set('Cookie', "token=" + adminToken)
        .send({ label });
    t.is(res.status, 200);
    t.is(res.body.label, label);
});

test('Get form by ID', async t => {
    const form = await prisma.form.create({ data: { label: 'Test Form' } });

    const res = await request(app)
        .get(`/api/form/${form.id}`)
        .set('Cookie', "token=" + adminToken)

    t.is(res.status, 200);
    t.deepEqual(res.body, form);
});

test('Edit form by ID', async t => {
    const form = await prisma.form.create({ data: { label: 'Test Form' } });

    const res = await request(app)
        .patch(`/api/form/edit/${form.id}`)
        .set('Cookie', "token=" + adminToken)
        .send({ label: 'Updated Test Form' });

    t.is(res.status, 200);

    t.is(res.body.label, 'Updated Test Form');

    const updatedForm = await prisma.form.findFirst({ where: { id: form.id } });
    t.is(updatedForm.label, 'Updated Test Form');
});

test('Delete a form by ID', async t => {
    const form = await prisma.form.create({ data: { label: 'Test Form' } });

    const res = await request(app)
        .delete(`/api/form/delete/${form.id}`)
        .set('Cookie', "token=" + adminToken)
        .expect(200);

    t.is(res.body.message, 'Form deleted');
});

test('View all forms', async t => {
    const res = await request(app)
        .get('/api/form/view')
        .set('Cookie', "token=" + token)
        .expect(200);
    t.true(Array.isArray(res.body), 'Response should be an array');
    t.true(res.body.length > 0, 'Array should not be empty');
});

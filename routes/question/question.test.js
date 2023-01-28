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

test('Create a question', async (t) => {
    const form = await prisma.form.create({ data: { label: 'Test Form' } });
    const label = 'Test Question';
    const res = await request(app)
        .post('/api/question/create')
        .set('Cookie', "token=" + adminToken)
        .send(
            { label, required: true, formId: form.id }
        );
    t.is(res.status, 200);
    t.is(res.body.label, label);
});

test('Get question by ID', async t => {
    const form = await prisma.form.create({ data: { label: 'Test Form' } });
    const question = await prisma.question.create(
        {
            data: {
                label: 'Test Question',
                required: true,
                formId: form.id
            }
        }
    );

    const res = await request(app)
        .get(`/api/question/${question.id}`)
        .set('Cookie', "token=" + adminToken)

    t.is(res.status, 200);
    t.deepEqual(res.body, question);
});

test('Edit question by ID', async t => {
    const form = await prisma.form.create({ data: { label: 'Test Form' } });
    const question = await prisma.question.create(
        {
            data: {
                label: 'Test Question',
                required: true,
                formId: form.id
            }
        }
    );
    const res = await request(app)
        .patch(`/api/question/edit/${question.id}`)
        .set('Cookie', "token=" + adminToken)
        .send(
            {
                label: 'Updated Test Question',
                required: true,
                formId: form.id
            },

        );

    t.is(res.status, 200);

    t.is(res.body.label, 'Updated Test Question');

    const updatedQuestion = await prisma.question.findFirst({ where: { id: question.id } });
    t.is(updatedQuestion.label, 'Updated Test Question');
});

test('Delete a question by ID', async t => {
    const form = await prisma.form.create({ data: { label: 'Test Form' } });
    const question = await prisma.question.create(
        {
            data: {
                label: 'Test Question',
                required: true,
                formId: form.id
            }
        }
    );
    const res = await request(app)
        .delete(`/api/question/delete/${question.id}`)
        .set('Cookie', "token=" + adminToken)
        .expect(200);

    t.is(res.body.message, 'Question deleted');
});

test('View all questions', async t => {
    const res = await request(app)
        .get('/api/question/view')
        .set('Cookie', "token=" + token)
        .expect(200);
    t.true(Array.isArray(res.body), 'Response should be an array');
    t.true(res.body.length > 0, 'Array should not be empty');
});

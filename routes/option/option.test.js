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

test('Create an option', async (t) => {
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
    const label = 'Test Option';
    const res = await request(app)
        .post('/api/option/create')
        .set('Cookie', "token=" + adminToken)
        .send(
            { label, questionId: question.id }
        );
    t.is(res.status, 200);
    t.is(res.body.label, label);
});

test('Get an option by ID', async t => {
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

    const option = await prisma.option.create({
        data: {
            label: "Option 1",
            question: {
                connect: {
                    id: question.id
                }
            }
        }
    });

    const res = await request(app)
        .get(`/api/option/${option.id}`)
        .set('Cookie', "token=" + adminToken)

    t.is(res.status, 200);
    t.deepEqual(res.body, option);
});

test('Edit an option by ID', async t => {
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

    const option = await prisma.option.create({
        data: {
            label: "Option 1",
            question: {
                connect: {
                    id: question.id
                }
            }
        }
    });

    const res = await request(app)
        .patch(`/api/option/edit/${option.id}`)
        .set('Cookie', "token=" + adminToken)
        .send(
            {
                label: 'Updated Test Option',
                questionId: question.id
            },

        );

    t.is(res.status, 200);
    t.deepEqual(res.body.label, 'Updated Test Option');
});

test('Delete an option by ID', async t => {
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

    const option = await prisma.option.create({
        data: {
            label: "Option 1",
            question: {
                connect: {
                    id: question.id
                }
            }
        }
    });

    const res = await request(app)
        .delete(`/api/option/delete/${option.id}`)
        .set('Cookie', "token=" + adminToken)
        .expect(200);

    t.is(res.body.message, 'Option deleted');
});

test('View all options', async t => {
    const res = await request(app)
        .get('/api/option/view')
        .set('Cookie', "token=" + token)
        .expect(200);
    t.true(Array.isArray(res.body), 'Response should be an array');
    t.true(res.body.length > 0, 'Array should not be empty');
});

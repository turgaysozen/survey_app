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

test('Submit survey with authentication', async t => {
    const email = random.email();
    const password = random.string();

    const form = await prisma.form.create({ data: { label: 'Test Form' } });
    const question = await prisma.question.create({
        data: {
            label: "label",
            required: true,
            form: {
                connect: {
                    id: form.id
                }
            }
        }
    })
    const user = await prisma.user.create({
        data: {
            firstName: 'Admin',
            lastName: 'admin',
            email: email,
            role: 'Admin',
            password: password
        }
    });

    const res = await request(app)
        .post(`/api/survey/submit/${form.id}`)
        .set('Cookie', "token=" + token)
        .send({
            userId: user.id,
            responses: [
                { answer: 'Test answer 1', questionId: question.id }
            ]
        });
    t.is(res.status, 200);
    t.is(res.body, 'Survey successfully submitted');
});

test('Get a single survey', async (t) => {
    const email = random.email();
    const password = random.string();

    const form = await prisma.form.create({ data: { label: 'Test Form' } });
    const question = await prisma.question.create({
        data: {
            label: "label",
            required: true,
            form: {
                connect: {
                    id: form.id
                }
            }
        }
    })
    const user = await prisma.user.create({
        data: {
            firstName: 'Admin',
            lastName: 'admin',
            email: email,
            role: 'Admin',
            password: password
        }
    });
    const resp = [
        {
            "answer": "Answer 1"
        },
        {
            "answer": "Answer 2"
        }
    ]

    const survey = await prisma.survey.create({
        data: {
            form: {
                connect: {
                    id: form.id
                }
            },
            user: {
                connect: {
                    id: user.id
                }
            },
            responses: {
                create: resp.map(response => ({
                    answer: response.answer,
                    question: {
                        connect: {
                            id: question.id
                        }
                    }
                }))
            }
        }
    })

    const res = await request(app)
        .get(`/api/survey/${survey.id}`)
        .set('Cookie', "token=" + adminToken)
    t.is(res.status, 200);
});

test('Get all surveys', async (t) => {
    const res = await request(app)
        .get('/api/survey/all')
        .set('Cookie', "token=" + adminToken)
    t.is(res.status, 200);
    t.true(Array.isArray(res.body), 'Body should be an array');
});

test('Delete a survey', async (t) => {
    const email = random.email();
    const password = random.string();

    const form = await prisma.form.create({ data: { label: 'Test Form' } });
    const question = await prisma.question.create({
        data: {
            label: "label",
            required: true,
            form: {
                connect: {
                    id: form.id
                }
            }
        }
    })
    const user = await prisma.user.create({
        data: {
            firstName: 'Admin',
            lastName: 'admin',
            email: email,
            role: 'Admin',
            password: password
        }
    });
    const resp = [
        {
            "answer": "Answer 1"
        },
        {
            "answer": "Answer 2"
        }
    ]

    const survey = await prisma.survey.create({
        data: {
            form: {
                connect: {
                    id: form.id
                }
            },
            user: {
                connect: {
                    id: user.id
                }
            },
            responses: {
                create: resp.map(response => ({
                    answer: response.answer,
                    question: {
                        connect: {
                            id: question.id
                        }
                    }
                }))
            }
        }
    })

    const res = await request(app)
        .delete(`/api/survey/delete/${survey.id}`)
        .set('Cookie', "token=" + adminToken)
    t.is(res.status, 200);
    t.is(res.body.message, 'Survey deleted', 'Should return survey deleted message');
});

const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Submit a survey by form ID
router.post('/:formId', async (req, res) => {
    const { formId } = req.params;
    const { userId, responses } = req.body;
    try {
        await prisma.survey.create({
            data: {
                form: {
                    connect: {
                        id: Number(formId)
                    }
                },
                user: {
                    connect: {
                        id: userId
                    }
                },
                responses: {
                    create: responses.map(response => ({
                        answer: response.answer,
                        question: {
                            connect: {
                                id: response.questionId
                            }
                        }
                    }))
                }
            }
        })
        return res.json(`Survey successfully submitted`);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while submitting survey' });
    }
});

module.exports = router;
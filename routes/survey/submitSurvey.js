const router = require('express').Router();
const logger = require('../../logger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
@function POST /api/survey/submit/:formId
@desc Submit a survey by form ID
@param {Number} formId - The ID of the form that the survey is being submitted for
@property {Number} userId - The ID of the user who is submitting the survey
@property {Object[]} responses - Responses for submitting the survey
answer: {string} the answer to the question
questionId: {Number} the ID of the question that the answer corresponds to
*/

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
        logger.error(`An error occurred while submitting survey with following error: ${error}`);
        return res.status(500).json({ error: 'An error occurred while submitting survey' });
    }
});

module.exports = router;
const router = require('express').Router();
const logger = require('../../logger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * @function GET /api/survey/all
 * @description Get all surveys including responses, questions and options
 * @returns {Object} surveys - List of all surveys
 * @returns {Object} surveys.responses - List of responses for the survey
 * @returns {Object} surveys.responses.question - Question associated with the response
 * @returns {Object} surveys.responses.question.option - Options associated with the question
 * @throws {Error} error - An error occurred while getting surveys
 */

// Get all survey
router.get('/all', async (req, res) => {
    try {
        const surveys = await prisma.survey.findMany({
            include: {
                responses: {
                    include: {
                        question: {
                            include: {
                                option: true
                            }
                        }
                    }
                }
            }
        });
        return res.json(surveys);
    } catch (error) {
        logger.error(`An error occurred while getting surveys with following error: ${error}`);
        return res.status(500).json({ error: 'An error occurred while getting surveys' });
    }
});

/**
 * @function GET /api/survey/:id
 * @description Get a survey by ID, including questions and options
 * @param {Number} required - ID of the survey
 * @returns {Object} form - The requested survey
 * @returns {Object} form.question - List of questions for the survey
 * @returns {Object} form.question.option - List of options for the question
 * @throws {Error} error - An error occurred while getting survey
 */

// Get a survey by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const form = await prisma.form.findFirst({
            where: { id: Number(id) },
            include: {
                question: {
                    include: {
                        option: true
                    }
                }
            }
        })
        return res.json(form);
    } catch (error) {
        logger.error(`An error occurred while getting survey for id: ${id} with following error: ${error}`);
        return res.status(500).json({ message: 'An error occurred while getting survey' });
    }
});

/**
 * @function DELETE /api/survey/delete/:id
 * @description Delete a survey by ID
 * @param {Number} id - ID of the survey
 * @returns {Object} message - Success message
 * @throws {Error} error - An error occurred while deleting survey
 */

// Delete a survey by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.survey.delete({ where: { id: Number(id) } });
        return res.json({ message: 'Survey deleted' });
    } catch (error) {
        logger.error(`An error occurred while deleting survey for id: ${id} with following error: ${error}`);
        return res.status(500).json({ error: 'An error occurred while deleting survey' });
    }
})

module.exports = router;
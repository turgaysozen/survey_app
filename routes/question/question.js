const router = require('express').Router();
const logger = require('../../logger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * @function POST /api/question/create
 * @property {String} label - The label of the question
 * @property {boolean} required - A flag indicating if the question is required
 * @property {Number} formId - The ID of the form the question belongs to
 * @returns {Object} - The created question
 * @throws {Error} - If there is an error while creating the question
 * @roles Admin - Only Admin role can view this page
 */

// Create a question
router.post('/create', async (req, res) => {
    const { label, required, formId } = req.body;
    try {
        const question = await prisma.question.create({
            data: {
                label,
                required,
                form: {
                    connect: {
                        id: formId
                    }
                }
            }
        })
        return res.json(question);
    } catch (error) {
        logger.error(`An error occurred while creating question with following error: ${error}`);
        return res.status(500).json({ error: 'An error occurred while creating question' });
    }
});

/**
 * @function GET /api/question/:id
 * @param {Number} id - The ID of the question
 * @returns {Object} - The question with the specified ID
 * @throws {Error} - If there is an error while getting the question
 * @roles Admin - Only Admin role can view this page
 */

// Get a question by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const question = await prisma.question.findFirst({ where: { id: Number(id) } });
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        return res.json(question);
    } catch (error) {
        logger.error(`An error occurred while getting question for id: ${id} with following error: ${error}`);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * @function PATCH /api/question/edit/:id
 * @param {Number} id - The ID of the question
 * @property {string} label - The new label of the question
 * @property {boolean} required - A flag indicating if the question is required
 * @property {Number} formId - The new ID of the form the question belongs to
 * @returns {Object} - The updated question
 * @throws {Error} - If there is an error while updating the question
 * @roles Admin - Only Admin role can view this page
 */

// Update a question by ID
router.patch('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { label, required, formId } = req.body;
    try {
        const question = await prisma.question.update({
            where: { id: Number(id) },
            data: {
                label,
                required,
                form: {
                    connect: {
                        id: formId
                    }
                }
            }
        });
        return res.json(question);
    } catch (error) {
        logger.error(`An error occurred while updating question for id: ${id} with following error: ${error}`);
        return res.status(500).json({ error: 'An error occurred while updating question' });
    }
});

/**
 * @function DELETE /api/question/delete/:id
 * @param {Number} id - The ID of the question
 * @returns {Object} - A message indicating the question has been deleted
 * @throws {Error} - If there is an error while deleting the question
 * @roles Admin - Only Admin role can view this page
 */

// Delete a question by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.question.delete({ where: { id: Number(id) } });
        return res.json({ message: 'Question deleted' });
    } catch (error) {
        logger.error(`An error occurred while deleting question for id: ${id} with following error: ${error}`);
        return res.status(500).json({ error: 'An error occurred while deleting question' });
    }
});

module.exports = router;
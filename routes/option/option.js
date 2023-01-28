const router = require('express').Router();
const logger = require('../../logger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * @function POST /api/option/create
 * @property {String} label - The label for the option.
 * @property {Number} questionId - The ID of the question to connect the option to.
 * @returns {Object} option - The created option.
 * @throws {Error} An error occurred while creating option.
 * @roles Admin - Only Admin role can view this page
 */

// Create an option
router.post('/create', async (req, res) => {
    const { label, questionId } = req.body;
    try {
        const option = await prisma.option.create({
            data: {
                label,
                question: {
                    connect: {
                        id: questionId
                    }
                }
            }
        })
        return res.json(option);
    } catch (error) {
        logger.error(`An error occurred while creating option with following error: ${error}`);
        return res.status(500).json({ error: 'An error occurred while creating option' });
    }
});

/**
 * @function GET /api/option/:id
 * @param {Number} id - The ID of the option to retrieve.
 * @returns {Object} option - The retrieved option.
 * @throws {Error} An error occurred while getting option.
 * @roles Admin - Only Admin role can view this page
 */

// Get an option by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const option = await prisma.option.findFirst({ where: { id: Number(id) } });
        return res.json(option);
    } catch (error) {
        logger.error(`An error occurred while getting option for id: ${id} with following error: ${error}`);
        return res.status(500).json({ error: 'An error occurred while getting option' });
    }
});

/**
 * @function PATCH /api/option/edit/:id
 * @param {Number} id - The ID of the option to update.
 * @property {String} label - The updated label for the option.
 * @property {Number} questionId - The updated ID of the question to connect the option to.
 * @returns {Object} option - The updated option.
 * @throws {Error} An error occurred while updating option.
 * @roles Admin - Only Admin role can view this page
 */

// Update an option by ID
router.patch('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { label, questionId } = req.body;
    try {
        const option = await prisma.option.update({
            where: { id: Number(id) },
            data: {
                label,
                question: {
                    connect: { id: questionId }
                }
            }
        });
        return res.json(option);
    } catch (error) {
        logger.error(`An error occurred while updating option for id: ${id} with following error: ${error}`);
        return res.status(500).json({ error: 'An error occurred while updating option' });
    }
});

/**
 * @function DELETE /api/option/delete/:id
 * @param {Number} id - The ID of the option to delete.
 * @returns {Object} option - The retrieved option.
 * @throws {Error} An error occurred while getting option.
 * @roles Admin - Only Admin role can view this page
 */

// Delete an option by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.option.delete({ where: { id: Number(id) } });
        return res.json({ message: 'Option deleted' });
    } catch (error) {
        logger.error(`An error occurred while deleting option for id: ${id} with following error: ${error}`);
        return res.status(500).json({ error: 'An error occurred while deleting option' });
    }
});

module.exports = router;
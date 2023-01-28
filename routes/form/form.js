const router = require('express').Router();
const logger = require('../../logger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
@function POST /api/form/create
@description Endpoint for creating a new form.
@property {String} label - Label of the form
@returns {Object} JSON object containing the created form
@throws {500} - If there is an error while creating the form
@roles Admin - Only Admin role can view this page
*/

// Create a form
router.post('/create', async (req, res) => {
    try {
        const { label } = req.body;
        const form = await prisma.form.create({
            data: {
                label
            }
        });
        return res.json(form);
    } catch (error) {
        logger.error(`An error occurred while creating form with following error: ${error}`);
        return res.status(500).json({ error: 'An error occurred while creating form' });
    }
});

/**

@function GET /api/form/:id
@description Endpoint for getting a form by ID.
@param {Number} id - ID of the form to retrieve
@returns {Object} JSON object containing the retrieved form
@throws {500} - If there is an error while getting the form
@roles Admin - Only Admin role can view this page
*/

// Get a form by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const form = await prisma.form.findFirst({ where: { id: Number(id) } });
        return res.json(form);
    } catch (error) {
        logger.error(`An error occurred while getting form by formId: ${id} with following error: ${error}`);
        return res.status(500).json({ error: 'An error occurred while getting form' });
    }
});

/**
@function PATCH /api/form/edit/:id
@description Endpoint for updating a form by ID.
@param {Number} id - ID of the form to update
@property {String} label - Updated label of the form
@returns {Object} JSON object containing the updated form
@throws {500} - If there is an error while updating the form
@roles Admin - Only Admin role can view this page
*/

// Update a form by ID
router.patch('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { label } = req.body;
        const form = await prisma.form.update({
            where: { id: Number(id) },
            data: { label },
        })
        return res.json(form);
    } catch (error) {
        logger.error(`An error occurred while updating form by formId: ${id} with following error: ${error}`);
        return res.status(500).json({ error: 'An error occurred while updating form' });
    }
});

/**

@function DELETE /api/form/delete/:id
@description Endpoint for deleting a form by ID.
@param {Number} id - ID of the form to delete
@returns {Object} JSON object containing a message that the form has been deleted
@throws {500} - If there is an error while deleting the form
@roles Admin - Only Admin role can view this page
*/

// Delete a form by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.form.delete({ where: { id: Number(id) } });
        return res.json({ message: 'Form deleted' });
    } catch (error) {
        logger.error(`An error occurred while deleting form by formId: ${id} with following error: ${error}`);
        return res.status(500).json({ error: 'An error occurred while deleting form' });
    }
});


module.exports = router;
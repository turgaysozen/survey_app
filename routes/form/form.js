const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
        return res.status(500).json({ error: 'An error occurred while creating form' });
    }
});

// Get a form by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const form = await prisma.form.findFirst({ where: { id: Number(id) } });
        return res.json(form);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while getting form' });
    }
});

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
        return res.status(500).json({ error: 'An error occurred while updating form' });
    }
});

// Delete a form by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.form.delete({ where: { id: Number(id) } });
        return res.json({ message: 'Form deleted' });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while deleting form' });
    }
});


module.exports = router;
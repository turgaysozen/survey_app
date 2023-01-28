const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
        return res.status(500).json({ error: 'An error occurred while creating question' });
    }
});

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
        return res.status(500).json({ error: error.message });
    }
});

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
        return res.status(500).json({ error: 'An error occurred while updating question' });
    }
});

// Delete a question by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.question.delete({ where: { id: Number(id) } });
        return res.json({ message: 'Question deleted' });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while deleting question' });
    }
});

module.exports = router;
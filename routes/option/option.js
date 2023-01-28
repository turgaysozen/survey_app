const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
        return res.status(500).json({ error: 'An error occurred while creating option' });
    }
});

// Get an option by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const option = await prisma.option.findFirst({ where: { id: Number(id) } });
        return res.json(option);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while getting option' });
    }
});

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
        return res.status(500).json({ error: 'An error occurred while updating option' });
    }
});

// Delete an option by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.option.delete({ where: { id: Number(id) } });
        return res.json({ message: 'Option deleted' });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while deleting option' });
    }
});

module.exports = router;
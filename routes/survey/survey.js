const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
        return res.status(500).json({ error: 'An error occurred while getting surveys' });
    }
});

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
        return res.status(500).json({ message: 'An error occurred while getting survey' });
    }
});

// Delete a survey by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.survey.delete({ where: { id: Number(id) } });
        return res.json({ message: 'Survey deleted' });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while deleting survey' });
    }
})

module.exports = router;
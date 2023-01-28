const router = require('express').Router()

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.get('', async (req, res) => {
    try {
        const questions = await prisma.question.findMany()
        return res.json(questions)
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while getting questions' })
    }
});

module.exports = router
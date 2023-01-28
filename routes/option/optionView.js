const router = require('express').Router()

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.get('', async (req, res) => {
    try {
        const options = await prisma.option.findMany()
        return res.json(options)
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while getting options' })
    }
});

module.exports = router
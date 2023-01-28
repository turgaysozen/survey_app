const router = require('express').Router()

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.get('', async (req, res) => {
    try {
        const forms = await prisma.form.findMany()
        return res.json(forms)
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while getting forms' })
    }
});

module.exports = router
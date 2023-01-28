const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

/**
@function GET /api/form/view
@description Endpoint for retrieving a list of forms.
@returns {Array} Array of form objects
@throws {500} - If there is an error while retrieving forms
@roles User - Only User role can view this page
*/

router.get('', async (req, res) => {
    try {
        const forms = await prisma.form.findMany()
        return res.json(forms)
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while getting forms' })
    }
});

module.exports = router
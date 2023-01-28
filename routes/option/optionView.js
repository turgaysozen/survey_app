const router = require('express').Router();
const logger = require('../../logger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
@function GET /api/option/view
@description Endpoint for retrieving a list of options.
@returns {Array} Array of form objects
@throws {500} - If there is an error while retrieving options
@roles User - Only User role can view this page
*/

router.get('', async (req, res) => {
    try {
        const options = await prisma.option.findMany();
        return res.json(options);
    } catch (error) {
        logger.error(`An error occurred while getting options with following error: ${error}`);
        return res.status(500).json({ error: 'An error occurred while getting options' });
    }
});

module.exports = router
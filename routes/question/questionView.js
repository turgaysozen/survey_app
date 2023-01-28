const router = require('express').Router();
const logger = require('../../logger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * @function GET /api/question/view
 * @description Get all questions
 * @returns {object} questions - List of all questions
 * @returns {string} message - Success message
 * @throws {Error} error - An error occurred while getting questions
 * @roles User - Only User role can view this page
 */

router.get('', async (req, res) => {
    try {
        const questions = await prisma.question.findMany();
        return res.json(questions);
    } catch (error) {
        logger.error(`An error occurred while getting questions with following error: ${error}`);
        return res.status(500).json({ error: 'An error occurred while getting questions' });
    }
});

module.exports = router
/**
 * @function POST /api/auth/register
 * @description Endpoint for logging in a user.
 * @property {String} firstName - First Name of the user trying to register
 * @property {String} lastName - Last Name of the user trying to register
 * @property {String} role - Role of the user trying to register (Admin or User)
 * @property {String} email - Email of the user trying to register
 * @property {String} password - Password of the user trying to register
 * @returns {Object} JSON object containing a message and a token
 * @throws {400} - If email is already taken
 * @throws {500} - If there is an error while logging in
 * @access Public
 */

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../../logger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('', async (req, res) => {
  try {
    const { firstName, lastName, email, role, password } = req.body;

    // Check if email is already taken
    const emailTaken = await prisma.user.findFirst({ where: { email } });
    if (emailTaken) {
      return res.status(400).json({ error: 'Email is already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        role
      }
    });

    // Send the token as a response
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 30 * 60 * 1000 });
    res.cookie('token', token, { httpOnly: true, expires: new Date(Number(new Date()) + 30 * 60 * 1000) });
    res.json({ message: 'user created', token });
  } catch (error) {
    logger.error(`An Error occured while registering for email ${email} with following error: ${err}`);
    res.status(500).json({ message: 'Error register in' });
  }
});

module.exports = router;
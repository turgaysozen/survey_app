/**
 * @function POST /api/auth/login
 * @description Endpoint for logging in a user.
 * @property {String} email - Email of the user trying to login
 * @property {String} password - Password of the user trying to login
 * @returns {Object} JSON object containing a message and a token
 * @throws {400} - If email or password is invalid
 * @throws {500} - If there is an error while logging in
 * @access Public
 */

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

router.post('', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 30 * 60 * 1000 });
    res.cookie('token', token, { httpOnly: true, expires: new Date(Number(new Date()) + 30 * 60 * 1000) });
    res.json({ message: 'Logged in successfully', token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;
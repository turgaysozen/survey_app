const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('', async (req, res) => {
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
  });

  module.exports = router;
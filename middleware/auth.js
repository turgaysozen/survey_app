const jwt = require('jsonwebtoken');
const config = require('../config');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const auth = (roles = []) => {
    return (req, res, next) => {
        const token = req.cookies.token;

        // verify jwt and check role of the user
        jwt.verify(token, config.secret, { expiresIn: 30 * 60 * 1000 }, async (err, authUser) => {
            if (err) return res.status(401).json({ "message": "Unauthenticated" })

            const id = authUser.id;
            const user = await prisma.user.findFirst({ where: { id } });
            // if there is a token in the cookie but there isn't an user in the db check user is null or not
            if (user) {
                if (!roles.includes(user.role)) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                next();
            }
            else {
                return res.status(401).json({ "message": "Unauthenticated" })
            }
        });
    }
}

module.exports = auth;
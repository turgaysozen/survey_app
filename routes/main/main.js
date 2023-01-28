const router = require('express').Router();

// Create an option
router.get('', async (req, res) => {
    res.send({ message: 'Survey App' });
});

module.exports = router;
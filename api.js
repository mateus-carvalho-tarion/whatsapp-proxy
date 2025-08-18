const router = require('express').Router();

router.post('/', async (req, res) => {
    try {
        console.log(req.body);
    } catch (err) {
        console.error('Error processing webhook:', err);
    }
    res.status(200).end();
});

module.exports = router;
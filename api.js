const axios = require('axios');
const router = require('express').Router();

router.post('/', async (req, res) => {
    try {
        // await axios.post(process.env.WEBHOOK_SITE_URL + req.originalUrl, extractedData);
        console.log(req.body);
    } catch (err) {
        console.error('Error processing webhook:', err);
    }
    res.status(200).end();
});

module.exports = router;
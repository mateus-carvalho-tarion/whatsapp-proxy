const router = require('express').Router();
const extractData = require('./utils/extract-data');

router.get('/', async (req, res) => {
    const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;
    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
        console.log('WEBHOOK VERIFIED');
        res.status(200).send(challenge);
    } else {
        console.error('WEBHOOK NOT VERIFIED', { mode, challenge, token });
        res.status(403).end();
    }
});

router.post('/', async (req, res) => {
    try {
        let extractedData = extractData.extract({ data: req.body });
        if (extractedData && extractedData.length > 0) console.log(JSON.stringify(extractedData, null, 2));
    } catch (err) {
        console.error('Error processing webhook:', err);
    }
    res.status(200).end();
});

module.exports = router;
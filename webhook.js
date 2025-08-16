const axios = require('axios');
const express = require('express');
const extractMessageData = require('./utils/extract-message-data');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

// Route for GET requests
app.get('/', async (req, res) => {
    await axios.get(process.env.WEBHOOK_SITE_URL + req.originalUrl);

    const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;
    if (mode === 'subscribe' && token === verifyToken) {
        console.log('WEBHOOK VERIFIED');
        res.status(200).send(challenge);
    } else {
        res.status(403).end();
    }
});

// Route for POST requests
app.post('/', async (req, res) => {
    try {
        await axios.post(process.env.WEBHOOK_SITE_URL + req.originalUrl, req.body);
        let extractedData = extractMessageData.extract({ data: req.body });
        console.log(JSON.stringify(extractedData, null, 2));
        await axios.post(process.env.WEBHOOK_SITE_URL + req.originalUrl, extractedData);
    } catch (err) {
        console.error('Error processing webhook:', err);
    }
    res.status(200).end();
});

// Start the server
app.listen(port, (err) => {
    if (err) console.error('Error starting server:', err);
    else console.log(`\nListening on port ${port}\n`);
});
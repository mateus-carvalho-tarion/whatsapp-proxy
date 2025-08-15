const axios = require('axios');
const express = require('express');

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
    await axios.get(process.env.WEBHOOK_SITE_URL + req.originalUrl, req.body);

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    console.log(`\n\nWebhook received ${timestamp}\n`);
    console.log(JSON.stringify(req.body, null, 2));
    res.status(200).end();
});

// Start the server
app.listen(port, (err) => {
    if (err) console.error('Error starting server:', err);
    else console.log(`\nListening on port ${port}\n`);
});
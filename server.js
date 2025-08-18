const express = require('express');
const api = require('./api');
const webhook = require('./webhook');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Register API routes
app.use('/api', api);
app.use('/webhook', webhook);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, (err) => {
    if (err) console.error('Error starting server:', err);
    else console.log(`Listening on port ${port}`);
});
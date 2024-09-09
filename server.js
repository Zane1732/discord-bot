const express = require('express');
const bodyParser = require('body-parser');
const { Client, Intents } = require('discord.js');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Handle form submission
app.post('/generate', async (req, res) => {
    // Extract data from the request
    const { count } = req.body;

    // Generate accounts (pseudo-code, replace with actual logic)
    const accounts = await generateAccounts(count);

    // Respond with the generated accounts
    res.json({ accounts });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Dummy function for account generation (replace with actual implementation)
async function generateAccounts(count) {
    // Replace this with your actual account generation logic
    return Array.from({ length: count }, (_, i) => `account${i + 1}`);
}

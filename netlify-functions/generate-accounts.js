const axios = require('axios');

exports.handler = async (event, context) => {
  try {
    // Generate a mock account
    const account = {
      username: `user${Math.floor(Math.random() * 10000)}`,
      password: `pass${Math.floor(Math.random() * 10000)}`
    };

    // Discord webhook URL
    const webhookUrl = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN';

    // Send account details to Discord
    await axios.post(webhookUrl, {
      content: `New account generated:\nUsername: ${account.username}\nPassword: ${account.password}`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Account generated and sent to webhook', account })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error generating account or sending to webhook' })
    };
  }
};

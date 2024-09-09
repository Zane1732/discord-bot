const axios = require('axios');

exports.handler = async (event, context) => {
  try {
    // Generate a mock account
    const account = {
      username: `user${Math.floor(Math.random() * 10000)}`,
      password: `pass${Math.floor(Math.random() * 10000)}`
    };

    // Discord webhook URL
    const webhookUrl = 'https://discord.com/api/webhooks/1282821531961000017/56r3vhyWh-u82fbLYVZBS9CwFTPEbUvYPVCMzx50YFq2OqDi1mNqpF9lCVbt8lr7QA39';

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

document.getElementById('generate-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const serverLink = document.getElementById('server-link').value;

  // Validate server link format with a comprehensive regex
  const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/;
  if (!serverLink || !urlPattern.test(serverLink)) {
    updateUI("Please enter a valid server link!", "error");
    return;
  }

  // Start generating tokens and joining the server
  updateUI('Generating tokens and attempting to join the server...', "loading");
  generateAndJoinTokens(serverLink);
});

// Function to generate tokens in a loop and join the server
function generateAndJoinTokens(serverLink) {
  const tokenApiUrl = 'https://run.mocky.io/v3/b88bfae0-a26b-49d3-8bf4-17ba902986e3'; // Mocky API URL for token generation
  const botToken = 'QHszWnXJqO_iSFCNOzOGUAizY2ZZXFj2'; // Your actual bot token
  const joinApiUrl = `https://discord.com/api/v10/invites/${extractInviteCodeFromLink(serverLink)}`; // Correct endpoint for joining servers

  function generateToken() {
    return fetch(tokenApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    }).then(handleFetchResponse)
      .then(data => data.token); // Adjust based on your actual response format
  }

  function joinServer(token) {
    return fetch(joinApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json'
      }
    }).then(handleFetchResponse);
  }

  function processToken() {
    generateToken()
      .then(validToken => {
        if (validToken) {
          return joinServer(validToken);
        } else {
          throw new Error('Invalid token');
        }
      })
      .then(() => {
        updateUI('Successfully joined the server with a valid token!', "success");
      })
      .catch(error => {
        console.error('Error:', error);
        updateUI('Error with the token or joining the server. Please try again.', "error");
      })
      .finally(() => {
        setTimeout(processToken, 10000); // Generate and process the next token after 10 seconds
      });
  }

  processToken(); // Start the token generation and joining process
}

// Helper function to extract invite code from server link
function extractInviteCodeFromLink(serverLink) {
  const url = new URL(serverLink);
  return url.pathname.split('/').pop(); // Adjust this based on your actual URL structure
}

// Helper function to update the UI element with the result message
function updateUI(message, type = "info") {
  const resultElement = document.getElementById('result');
  resultElement.innerText = message;
  resultElement.className = type; // Assumes CSS classes for different types: info, loading, error, success
}

// Function to handle the fetch response
function handleFetchResponse(response) {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

// Function to handle fetch errors
function handleFetchError(error) {
  console.error('Error:', error);
  updateUI('Error generating token or joining the server. Please try again.', "error");
}

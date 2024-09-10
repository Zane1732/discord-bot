document.getElementById('generate-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const serverLink = document.getElementById('server-link').value;

  // Validate server link format with a comprehensive regex
  const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/;
  if (!serverLink || !urlPattern.test(serverLink)) {
    updateUI("Please enter a valid server link!", "error");
    return;
  }

  // Generating a unique token
  const code = generateUniqueToken();
  const tokenApiUrl = `https://run.mocky.io/v3/b88bfae0-a26b-49d3-8bf4-17ba902986e3?code=${encodeURIComponent(code)}`;

  // Update UI to show loading state
  updateUI('Generating token... Please wait...', "loading");

  fetch(tokenApiUrl)
    .then(handleFetchResponse)
    .then(data => {
      // Assuming the mock API returns a token in the response
      const token = data.token; // Adjust based on the actual mock API response
      updateUI(`Token Generated: ${token}. Joining server ${serverLink}...`, "success");
      
      // Proceed to join the server
      joinServer(token, serverLink);
    })
    .catch(handleFetchError)
    .finally(() => {
      clearResultAfterTimeout(5000); // Clear result message after 5 seconds
      resetForm(); // Optionally reset the form after submission
    });
});

// Function to join a server using the mock API
function joinServer(token, serverLink) {
  // For demonstration, we'll assume you need to send a POST request with token and server link
  const joinApiUrl = 'https://run.mocky.io/v3/your-join-server-endpoint'; // Replace with actual endpoint

  fetch(joinApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      serverLink: serverLink,
      token: token
    })
  })
    .then(handleFetchResponse)
    .then(data => {
      updateUI('Successfully joined the server!', "success");
    })
    .catch(error => {
      console.error('Error joining server:', error);
      updateUI('Error joining the server. Please check the server link and try again.', "error");
    });
}

// Helper function to extract server ID from the server link (if needed)
// You might not need this function if your API doesn't require extracting server ID
function extractServerIdFromLink(serverLink) {
  // Implement logic to extract the server ID from the server link
  // This example assumes the server ID is part of the URL path
  const url = new URL(serverLink);
  return url.pathname.split('/').pop(); // Adjust this based on your actual URL structure
}

// Helper function to generate a unique token
function generateUniqueToken() {
  return Math.random().toString(36).substring(2, 15);
}

// Helper function to update the UI element with the result message
function updateUI(message, type = "info") {
  const resultElement = document.getElementById('result');
  resultElement.innerText = message;
  // Optional: Apply different styles based on message type
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

// Optional: Function to reset the form after submission
function resetForm() {
  document.getElementById('generate-form').reset();
}

// Optional: Function to clear the result display after a certain timeout
function clearResultAfterTimeout(timeout) {
  setTimeout(() => {
    updateUI('');
  }, timeout);
}

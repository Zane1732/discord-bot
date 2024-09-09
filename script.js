async function createAccountsAndSolveCaptcha(mode, email, humanize, threads, invite, output) {
    console.log(`Creating accounts and joining servers...`);

    try {
        const response = await fetch('http://127.0.0.1:5000/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ serverLink: invite })
        });

        const data = await response.json();
        if (response.ok) {
            console.log(`Accounts joined: ${data.joinedCount}`);
            document.getElementById('result').innerHTML = `Generation Completed! Accounts joined: ${data.joinedCount}`;
        } else {
            throw new Error(data.error || 'An unknown error occurred');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').innerHTML = `Error: ${error.message}`;
    }
}

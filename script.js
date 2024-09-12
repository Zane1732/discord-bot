document.getElementById('generate-btn').addEventListener('click', async function() {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = "Generating...";  // Show loading state

    // Call the main function to generate the Roblox account or CAPTCHA solution
    try {
        const apiKey = "https://run.mocky.io/v3/b88bfae0-a26b-49d3-8bf4-17ba902986e3";  // Replace with your actual API key
        const solver = new Solver(apiKey);
        const mailTM = new MailTM();

        const domain = await mailTM.getDomain();
        const mailAccount = await mailTM.createAccount(domain);

        if (mailAccount.status === "OK") {
            const token = await mailTM.getAccountToken(mailAccount.mail, mailAccount.password);

            if (token) {
                const blob = "example_blob_data"; // Replace with actual CAPTCHA blob
                const proxy = proxies[Math.floor(Math.random() * proxies.length)];

                // Solve CAPTCHA
                const captchaSolution = await solver.solve(blob, proxy);
                if (captchaSolution) {
                    resultDiv.textContent = `Captcha solution: ${captchaSolution}`;
                } else {
                    resultDiv.textContent = "Failed to solve CAPTCHA.";
                }
            } else {
                resultDiv.textContent = "Failed to get account token.";
            }
        } else {
            resultDiv.textContent = `Failed to create account: ${mailAccount.response}`;
        }
    } catch (error) {
        resultDiv.textContent = `An error occurred: ${error}`;
    }
});

// Define Solver class
class Solver {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async solve(blob, proxy) {
        try {
            let formattedProxy = proxy.includes('@') ? `http://${proxy}` : `http://${proxy}`;
            const code = randomString(10);
            const encodedCode = encodeURIComponent(code);
            const mockyUrl = `${this.apiKey}?code=${encodedCode}`;

            const response = await fetch(mockyUrl);
            const data = await response.json();

            if (!data.solution) {
                console.log("Error: Missing solution in response.");
                return false;
            }

            return data.solution;
        } catch (error) {
            console.log("Error occurred:", error);
            return false;
        }
    }
}

// Define MailTM class
class MailTM {
    constructor() {
        this.apiBase = "https://api.mail.tm";
    }

    async getDomain() {
        const response = await fetch(`${this.apiBase}/domains`);
        const data = await response.json();
        return data['hydra:member'][0]['domain'];
    }

    async createAccount(domain) {
        const mail = randomString(10).toLowerCase();
        const password = `${randomString(5)}${Math.floor(Math.random() * 900 + 100)}${["!", "*", "$"][Math.floor(Math.random() * 3)]}`;

        const accountData = {
            address: `${mail}@${domain}`,
            password: password
        };

        const response = await fetch(`${this.apiBase}/accounts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(accountData)
        });

        const data = await response.json();
        if (response.status === 201) {
            console.log(`Created account: ${mail}@${domain}`);
            return { status: "OK", mail: `${mail}@${domain}`, password: password };
        } else {
            console.log(`Failed to create account: ${response.statusText}`);
            return { status: "ERROR", response: data };
        }
    }

    async getAccountToken(mail, password) {
        const loginData = {
            address: mail.trim(),
            password: password.trim()
        };

        const response = await fetch(`${this.apiBase}/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();
        if (response.status === 200) {
            console.log("Got token: ", data.token);
            return data.token;
        } else {
            console.log("Failed to get token: ", data.message);
            return null;
        }
    }
}

// Helper function to generate random strings
function randomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Example proxies list
const proxies = [
    "user:password@5.161.115.29:51111",
    "user:password@23.254.231.55:80",
    // Add more proxies here
];

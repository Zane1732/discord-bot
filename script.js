// Proxy List (add your proxies here)
const proxies = [
    "user:password@5.161.115.29:51111",
    "user:password@23.254.231.55:80",
    "user:password@5.161.114.204:4228",
    "user:password@198.199.86.11:8080",
    "user:password@84.252.73.132:4444",
    "user:password@222.89.237.101:9002",
    "user:password@67.43.227.227:12827",
    "user:password@141.145.214.176:80",
    "user:password@201.134.169.214:8205",
    "user:password@152.26.231.94:9443",
    "user:password@8.219.97.248:80",
    "user:password@65.108.207.6:80",
    "user:password@135.181.154.225:80",
    "user:password@67.43.227.227:2659",
    "user:password@20.13.148.109:8080",
    "user:password@67.43.228.254:7271"
];

// Function to generate a random string
function randomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Solver class
class Solver {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async solve(blob, proxy) {
        try {
            let formattedProxy = '';

            // Handle proxies in the format 'user:password@ip:port'
            if (proxy.includes('@')) {
                const [auth, ipPort] = proxy.split('@');
                const [user, password] = auth.split(':');
                const [ip, port] = ipPort.split(':');
                formattedProxy = `http://${user}:${password}@${ip}:${port}`;
            } else {
                const [ip, port] = proxy.split(':');
                formattedProxy = `http://${ip}:${port}`;
            }

            // Simulate getting a code for CAPTCHA solution
            const code = randomString(10);  // Simulate code; replace with actual CAPTCHA solving logic
            const encodedCode = encodeURIComponent(code);
            const mockyUrl = `https://run.mocky.io/v3/b88bfae0-a26b-49d3-8bf4-17ba902986e3?code=${encodedCode}`;

            const response = await fetch(mockyUrl, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (!data.solution) {
                console.log("Error: Missing solution in response.");
                console.log("Response:", data);
                return false;
            }

            const captchaSolution = data.solution;
            console.log(`Solved captcha: ${captchaSolution.slice(0, 60)}...`);
            return captchaSolution;

        } catch (error) {
            console.log(`Error occurred: ${error}`);
            return false;
        }
    }
}

// MailTM class
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

    async getMail(token) {
        const response = await fetch(`${this.apiBase}/messages`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log("Received emails: ", data);
        return data;
    }

    async getMailContent(token, messageId) {
        const response = await fetch(`${this.apiBase}/messages/${messageId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data;
    }
}

// Main function
async function main() {
    const apiKey = "https://run.mocky.io/v3/b88bfae0-a26b-49d3-8bf4-17ba902986e3";  // Replace with your actual API key
    const solver = new Solver(apiKey);
    const mailTM = new MailTM();

    try {
        const domain = await mailTM.getDomain();
        const mailAccount = await mailTM.createAccount(domain);

        if (mailAccount.status === "OK") {
            const token = await mailTM.getAccountToken(mailAccount.mail, mailAccount.password);
            
            if (token) {
                // Example CAPTCHA blob data, replace with actual blob
                const blob = "example_blob_data";

                // Randomly select a proxy for this example
                const proxy = proxies[Math.floor(Math.random() * proxies.length)];

                // Solve CAPTCHA
                const captchaSolution = await solver.solve(blob, proxy);
                if (captchaSolution) {
                    console.log(`Captcha solution: ${captchaSolution}`);
                } else {
                    console.log("Failed to solve CAPTCHA.");
                }
            }
        } else {
            console.log(`Failed to create account: ${mailAccount.response}`);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

// Run the main function
main();

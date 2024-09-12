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

            const response = await fetch(mockyUrl, {
                method: 'GET',
                headers: {
                    'Proxy-Authorization': `Basic ${btoa(formattedProxy)}`
                }
            });
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
    // Add more proxies here if needed
];

// Event listener for the generate button
document.getElementById('generate-btn').addEventListener('click', async function() {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = "Generating...";  // Show loading state

    try {
        const apiKey = "https://run.mocky.io/v3/b88bfae0-a26b-49d3-8bf4-17ba902986e3";  // Replace with your actual API key
        const solver = new Solver(apiKey);
        const mailTM = new MailTM();

        const domain = await mailTM.getDomain();
        const mailAccount = await mailTM.createAccount(domain);

        if (mailAccount.status === "OK") {
            const token = await mailTM.getAccountToken(mailAccount.mail, mailAccount.password);

            if (token) {
                // Select the CAPTCHA element (assuming it's an image)
                const captchaImage = document.querySelector('img.captcha');

                if (captchaImage) {
                    // Ensure the image is fully loaded
                    if (captchaImage.complete && captchaImage.naturalHeight !== 0) {
                        // Fetch the CAPTCHA image as a blob
                        const response = await fetch(captchaImage.src);
                        const blob = await response.blob();

                        // Convert the blob to a base64-encoded string if required by your solver API
                        const reader = new FileReader();
                        reader.onloadend = function() {
                            const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
                            console.log(base64String); // This is the CAPTCHA blob that can be sent to the solver

                            // Randomly select a proxy for this example
                            const proxy = proxies[Math.floor(Math.random() * proxies.length)];

                            // Solve CAPTCHA
                            solver.solve(base64String, proxy).then(captchaSolution => {
                                if (captchaSolution) {
                                    resultDiv.textContent = `Captcha solution: ${captchaSolution}`;
                                } else {
                                    resultDiv.textContent = "Failed to solve CAPTCHA.";
                                }
                            }).catch(error => {
                                resultDiv.textContent = `An error occurred: ${error}`;
                            });
                        };
                        reader.readAsDataURL(blob);
                    } else {
                        resultDiv.textContent = "CAPTCHA image is not fully loaded.";
                    }
                } else {
                    resultDiv.textContent = "CAPTCHA image element not found.";
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

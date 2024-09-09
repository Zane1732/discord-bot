from flask import Flask, request, jsonify
import requests
import time

app = Flask(__name__)

API_KEY = '2c126050348580c6744ba71fe5569bb5'

def solve_captcha(captcha_image_url):
    # Submit CAPTCHA to 2Captcha
    response = requests.post('http://2captcha.com/in.php', {
        'key': API_KEY,
        'method': 'post',
        'body': requests.get(captcha_image_url).content,
        'json': 1
    })
    captcha_id = response.json().get('request')

    # Poll for CAPTCHA result
    result = None
    while not result:
        response = requests.get(f'http://2captcha.com/res.php?key={API_KEY}&action=get&id={captcha_id}&json=1')
        result = response.json()
        if result.get('status') == 1:
            return result.get('request')

    return 'Failed to solve CAPTCHA'

@app.route('/solve-captcha', methods=['POST'])
def solve_captcha_endpoint():
    file = request.files['captcha_image']
    captcha_image_url = file.filename  # This should be the URL of the CAPTCHA image
    captcha_text = solve_captcha(captcha_image_url)
    return jsonify({'captcha_text': captcha_text})

@app.route('/start', methods=['POST'])
def start():
    data = request.json
    server_link = data.get('serverLink')
    
    # Here you would call your account creation and joining logic
    # Simulate account creation and joining
    joined_count = 0
    for _ in range(10):  # Simulate 10 accounts
        # Implement account creation and joining logic
        time.sleep(1)  # Simulate time delay for account creation
        joined_count += 1

    return jsonify({'joinedCount': joined_count})

if __name__ == '__main__':
    app.run(port=5000)


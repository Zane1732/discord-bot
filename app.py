from flask import Flask, request, jsonify
import random

app = Flask(__name__)

def generate_token():
    return "fake_token_" + str(int(1000 * random.random()))

def check_token(token):
    return token.startswith("fake_token_")

def join_server(token, server_link):
    # Simulate the process of joining a server
    return server_link.startswith('https://discord.gg/')

@app.route('/process', methods=['POST'])
def process():
    data = request.json
    server_link = data.get('serverLink')

    if server_link:
        checked_count = 0
        joined_count = 0
        for _ in range(100):  # Simulate generating and checking 100 tokens
            token = generate_token()
            checked_count += 1
            if check_token(token) and join_server(token, server_link):
                joined_count += 1

        return jsonify({'message': 'Process Completed!', 'checkedCount': checked_count, 'joinedCount': joined_count})
    else:
        return jsonify({'error': 'No server link provided'}), 400

if __name__ == '__main__':
    app.run(port=5000)


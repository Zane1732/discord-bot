from flask import Flask, request, jsonify

app = Flask(__name__)

# Example function to create an account
def create_account():
    # Simulate account creation
    return "fake_token_" + str(int(1000 * random.random()))

# Example function to join a server
def join_server(token, server_link):
    # Simulate joining a server
    # Replace this with actual API call to join the server
    return True

@app.route('/start', methods=['POST'])
def start():
    data = request.json
    server_link = data.get('serverLink')

    if server_link:
        joined_count = 0
        for _ in range(100):  # Change this to your desired number of accounts
            token = create_account()
            if join_server(token, server_link):
                joined_count += 1
            else:
                print(f"Failed to join server with token: {token}")

        return jsonify({'message': 'Generation Completed! Joined the server.', 'joinedCount': joined_count})
    else:
        return jsonify({'error': 'No server link provided'}), 400

if __name__ == '__main__':
    app.run(port=5000)

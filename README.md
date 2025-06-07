# Marvel Multiplayer Guess Game

This project turns the original Marvel API demo into a simple multiplayer guessing game. The server fetches a list of characters from the Marvel API and players compete to guess which hero was chosen.

## Setup

1. Run `npm install` to install dependencies.
2. Create a `.env` file and set `MARVEL_PUBLIC_KEY` and `MARVEL_PRIVATE_KEY` with your API credentials.
3. Start the server with `npm start`.
4. Open `http://localhost:3000` in multiple browsers or devices to play with friends.

When the game starts you'll see a clue showing the first letter of a random Marvel hero. Send guesses and the server will broadcast results to all connected players.

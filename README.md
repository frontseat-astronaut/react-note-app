# NOTES APP
Hi! This is a note-taking app I built using React and Apollo GraphQL. 

## Steps to Run
- Install `Node.js` and `npm` on your machine
- Clone repo and go to root directory
- Run `npm install`. This will install all the dependencies
- Run `npm start`. This should open up the app webpage on your browser (typically on `localhost:3000`). You'll get the message `Error in Receiving Notes!`. That's because we haven't started the server yet, where all the notes are stored.
- Run `node src/server.js`. Now go back to the app, it should have loaded up!

Ensure that you always run `server.js` from the same directory so as to store notes in the same JSON file (`notes.json`).
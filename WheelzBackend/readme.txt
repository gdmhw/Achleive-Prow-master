The server is configured with nginx that uses a reverse proxy for proxing https traffic as http to the node app, this provides the API with full SSL certification for https

For running the API we use pm2 which is a manager for nodejs applications.
The command:
	pm2 start bin/www
starts the API and will keep it going. We use nodemon to monitor any changes and restart the server automatically with the new changes
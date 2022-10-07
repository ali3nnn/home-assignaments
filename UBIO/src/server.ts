import app from "./app";
import * as db from "./database";

export const PORT = process.env.PORT || 5000;

db.connect('ubio')
    .then(() => {
        // Start the server
        const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

        // Stop the server
        const shutDown = () => {
            server.close(() => {
                console.log("Shutdown the service")
                db.disconnect()
                process.exit(0)
            })
        }

        process.on('SIGTERM', shutDown);
        process.on('SIGINT', shutDown); 

        let connections = [];

        server.on('connection', connection => {
            connections.push(connection);
            connection.on('close', () => connections = connections.filter(curr => curr !== connection));
        });

    })
    .catch((err) => console.log(`Database connection error: ${err.message}`))
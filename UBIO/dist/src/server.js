"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// let fetch = require('node-fetch');
const app_1 = require("./app");
const db = require("./database");
// import { cron } from './worker';
const PORT = process.env.PORT || 5000;
// const CRON_INTERVAL = process.env.INSTANCE_EXPIRATION_SEC || 5000; // the time interval at which the task runs
db.connect('ubio')
    .then(() => {
    // Start the server
    const server = app_1.default.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    // Stop the server and clear the timerId
    const shutDown = () => {
        server.close(() => {
            console.log("Shutdown the service");
            process.exit(0);
        });
    };
    process.on('SIGTERM', shutDown);
    process.on('SIGINT', shutDown);
    let connections = [];
    server.on('connection', connection => {
        connections.push(connection);
        connection.on('close', () => connections = connections.filter(curr => curr !== connection));
    });
})
    .catch((err) => console.log(`Database connection error: ${err.message}`));

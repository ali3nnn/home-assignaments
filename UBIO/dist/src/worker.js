"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cron = void 0;
require("reflect-metadata");
const dotenv = require("dotenv");
dotenv.config();
const CRON_INTERVAL = process.env.INSTANCE_EXPIRATION_DATE_SEC || 5; // the time interval at which the task runs
const cron = (task, timeInterval) => {
    return setInterval(task, timeInterval);
};
exports.cron = cron;
// Create the task to remove older hearbeats
const task = () => {
    console.log(`${Date.now()} Cronjob is checking old heartbeats`);
    fetch('http://localhost:5000/removeExpiredInstances', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: '{}'
    });
};
// Start the worker
(0, exports.cron)(task, Number(CRON_INTERVAL) * 1000);

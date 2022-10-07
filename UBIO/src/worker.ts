import "reflect-metadata"
import { PORT } from './server';
import * as dotenv from 'dotenv';

dotenv.config();
const CRON_INTERVAL = process.env.INSTANCE_EXPIRATION_DATE_SEC || 5; // the time interval at which the task runs

export const cron = (task, timeInterval) => {
    return setInterval(task, timeInterval)
}

// Create the task to remove older hearbeats
const task = () => {
    console.log(`${Date.now()} Cronjob is checking old heartbeats`)
    fetch(`http://localhost:${PORT}/removeExpiredInstances`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: '{}'
    })
}

// Start the worker
cron(task, Number(CRON_INTERVAL) * 1000)


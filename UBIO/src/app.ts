import "reflect-metadata"
import { Express, Request, Response } from 'express';
import * as express from 'express';
import { container } from 'tsyringe';
import InstanceController from "./controllers/InstanceController";

const app: Express = express();

// Express configuration
app.use(express.json());

// DI container
export const instanceController = container.resolve(InstanceController);

// Rest Endpoints
app.get("/", async (req: Request, res: Response) => {
    await instanceController.describeAllGroups(res)
});

app.delete('/removeExpiredInstances', async (req: express.Request, res: express.Response) => {
    await instanceController.removeExpiredInstances(res)
});

app.post('/:group/:id', async (req: Request, res: Response) => {
    await instanceController.processHeartbeats(req, res)
});

app.delete('/:group/:id', async (req: Request, res: Response) => {
    await instanceController.unregisterInstance(req, res)
});

app.get('/:group', async (req: express.Request, res: express.Response) => {
    await instanceController.describeOneGroup(req, res)
});

export default app;
import { Request, Response } from 'express';
import InstanceService from '../services/InstanceService';
export default class InstanceController {
    service: InstanceService;
    constructor(service: InstanceService);
    processHeartbeats(req: Request, res: Response): Promise<Response>;
    unregisterInstance(req: Request, res: Response): Promise<Response>;
    describeAllGroups(res: Response): Promise<Response>;
    describeOneGroup(req: Request, res: Response): Promise<Response>;
    removeExpiredInstances(res: Response): Promise<void>;
}

import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { autoInjectable } from 'tsyringe';
import InstanceService from '../services/InstanceService';
import IInstance from '../interfaces/Instance.interface';

dotenv.config()

@autoInjectable()
export default class InstanceController {

    service: InstanceService;

    constructor(service: InstanceService) {
        this.service = service
    }

    async processHeartbeats(req: Request, res: Response): Promise<Response> {

        const { id, group, body } = this.service.paramsHandler(req)
        const isInstance: Boolean = await this.service.checkIfInstanceExists(id)
        if (isInstance) {
            try {
                const updatedInstance: IInstance = await this.service.updateInstance(id, body)
                return res.status(200).json(updatedInstance)
            } catch (e) {
                return res.status(500).json({
                    message: e.message
                })
            }
        } else {
            try {
                const instance: IInstance = await this.service.createInstance(id, group, body)
                return res.status(201).json(instance)
            } catch (e) {
                return res.status(500).json({
                    message: e.message
                })
            }
        }
    }

    async unregisterInstance(req: Request, res: Response): Promise<Response> {
        const { id } = this.service.paramsHandler(req)
        try {
            await this.service.deleteInstance(id)
            return res.status(200).send()
        } catch (e) {
            return res.status(500).send({
                message: e.message
            })
        }
    }

    async describeAllGroups(res: Response): Promise<Response> {
        try {
            const instances = await this.service.aggregateGroups()
            return res.status(200).send(instances)
        } catch (e) {
            res.status(404).send({
                message: e.message
            })
        }
    }

    async describeOneGroup(req: Request, res: Response): Promise<Response> {
        const { group } = this.service.paramsHandler(req)
        try {
            const instances = await this.service.findBy('group', group)
            return res.status(200).json(instances)
        } catch (e) {
            return res.status(404).send({
                message: e.message
            })
        }
    }

    async removeExpiredInstances(res: Response) {
        const threshold = Number(process.env.INSTANCE_EXPIRATION_DATE_SEC);

        const instanceIdsToDelete = await this.service.deleteOldInstancesBy(threshold);

        const deletionPromises = instanceIdsToDelete.map(instance => this.service.deleteInstance(instance.id));
        
        Promise.allSettled(deletionPromises)
        .then(responses => { return res.status(200) })
        .catch(err => { return res.status(500).send(err) })
    }
}
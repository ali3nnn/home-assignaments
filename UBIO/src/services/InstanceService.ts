import { autoInjectable } from 'tsyringe';
import { Request } from 'express';
import IInstance from '../interfaces/Instance.interface';
import { IInstanceModel } from '../models/Instance.model';
import InstanceRepository from '../repository/InstanceRepository';
import { LeanDocument } from 'mongoose';

@autoInjectable()
export default class InstanceService {

    instanceRepository: InstanceRepository

    constructor(instanceRepository: InstanceRepository) {
        this.instanceRepository = instanceRepository
    }

    async checkIfInstanceExists(id: string): Promise<Boolean> {
        const instance: {_id: string} = await this.instanceRepository.exists(id)
        return !!instance
    }

    async findInstanceById(id: string): Promise<IInstance[] | IInstance> {
        const instance: LeanDocument<IInstanceModel> = await this.instanceRepository.findById(id);
        return this.cleanseTheResponse(instance)
    }

    async aggregateGroups() {
        const instances: IInstance[] = await this.instanceRepository.findAllByGroups();
        if (!instances) {
            throw new Error("No group found")
        }
        return instances;
    }

    async findBy(key: string, value: string | object): Promise<IInstance[] | IInstance> {
        const instances: LeanDocument<IInstanceModel[]> = await this.instanceRepository.findBy(key, value)
        if (!instances.length) {
            throw new Error("No group found")
        }
        return this.cleanseTheResponse(instances)
    }

    async updateInstance(id: string, body?: object): Promise<IInstance> {
        const instance: LeanDocument<IInstanceModel> = await this.instanceRepository.findByIdAndUpdate(id, {
            updatedAt: Date.now(),
            ...(Object.keys(body).length && { meta: body })
        });
        return this.cleanseTheResponse(instance) as IInstance
    }

    async createInstance(id: string, group: string, body?: object): Promise<IInstance> {
        await this.instanceRepository.create({
            _id: id,
            group,
            ...(Object.keys(body).length && { meta: body })
        });
        const instance: LeanDocument<IInstanceModel> = await this.instanceRepository.findById(id)
        return this.cleanseTheResponse(instance) as IInstance
    }

    async deleteInstance(id: string): Promise<void> {
        const instance = await this.instanceRepository.findByIdAndDelete(id)
        if (!instance) {
            throw new Error('Request couldn\'t be completed');
        }
    }

    async deleteOldInstancesBy(threshold: number): Promise<IInstance[]> {
        const condition = {
            updatedAt: {
                $lt: Date.now() - threshold*1000
            }
        }
        const instancesToBeDeleted: LeanDocument<IInstanceModel[]> = await this.instanceRepository.findByIdCondition(condition)
        instancesToBeDeleted.forEach(instance => console.log(`Instance ${instance._id} passed the expiration date with ${(Date.now() - threshold*1000 - instance.updatedAt)/1000} sec`))
        return this.cleanseTheResponse(instancesToBeDeleted) as IInstance[]
    }

    private cleanseTheResponse(payload: null | IInstanceModel[] | IInstanceModel | LeanDocument<IInstanceModel> | LeanDocument<IInstanceModel[]>): null | IInstance[] | IInstance {
        if (!payload) {
            return payload as null
        } else if (Array.isArray(payload)) {
            const parsedPayload = payload.map((instance: IInstance | IInstanceModel) => {
                return this.cleanseTheResponse(instance)
            })
            return parsedPayload as IInstance[]
        } else {
            const { _id, ...instanceData } = payload 
            const parsedObject = {
                id: _id,
                ...instanceData
            }
            return parsedObject
        } 
    }

    paramsHandler(req: Request): {id?: string, group?: string, body?: object} {
        return {
            ...(req.params?.id && { id: req.params.id }),
            ...(req.params?.group && { group: req.params.group }),
            ...(req.body && { body: req.body }),
        }
    }
}
import { Request } from 'express';
import IInstance from '../interfaces/Instance.interface';
import InstanceRepository from '../repository/InstanceRepository';
export default class InstanceService {
    instanceRepository: InstanceRepository;
    constructor(instanceRepository: InstanceRepository);
    checkIfInstanceExists(id: string): Promise<Boolean>;
    findInstanceById(id: string): Promise<IInstance[] | IInstance>;
    aggregateGroups(): Promise<IInstance[]>;
    findBy(key: string, value: string | object): Promise<IInstance[] | IInstance>;
    updateInstance(id: string, body?: object): Promise<IInstance>;
    createInstance(id: string, group: string, body?: object): Promise<IInstance>;
    deleteInstance(id: string): Promise<void>;
    deleteOldInstancesBy(threshold: number): Promise<IInstance[]>;
    private cleanseTheResponse;
    paramsHandler(req: Request): {
        id?: string;
        group?: string;
        body?: object;
    };
}

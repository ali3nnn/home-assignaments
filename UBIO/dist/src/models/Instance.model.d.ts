import mongoose, { Document } from 'mongoose';
import IInstance from '../interfaces/Instance.interface';
export interface IInstanceModel extends Omit<IInstance, "id">, Document {
}
declare const _default: mongoose.Model<IInstanceModel, {}, {}, {}, any>;
export default _default;

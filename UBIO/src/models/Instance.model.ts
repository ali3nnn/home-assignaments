import mongoose, { Document, Schema } from 'mongoose';
import IInstance from '../interfaces/Instance.interface';

export interface IInstanceModel extends Omit<IInstance, "id">, Document { }

const InstanceSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      required: true
    },
    group: {
      type: String,
      required: true
    },
    createdAt: {
      type: Number
    },
    updatedAt: {
      type: Number
    },
    meta: {
      type: Object
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<IInstanceModel>('Instance', InstanceSchema);
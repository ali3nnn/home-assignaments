/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
export default class InstanceRepository {
    findBy(key: any, value: any): Promise<import("mongoose").LeanDocument<import("../models/Instance.model").IInstanceModel & {
        _id: import("mongoose").Types.ObjectId;
    }>[]>;
    findById(instanceId: any): Promise<import("mongoose").LeanDocument<import("../models/Instance.model").IInstanceModel & {
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findByIdAndUpdate(instanceId: any, payload: any): Promise<import("mongoose").LeanDocument<import("../models/Instance.model").IInstanceModel & {
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAllByGroups(): Promise<any[]>;
    findAll(): Promise<import("mongoose").LeanDocument<import("../models/Instance.model").IInstanceModel & {
        _id: import("mongoose").Types.ObjectId;
    }>[]>;
    create(payload: any): Promise<void>;
    findByIdAndDelete(id: any): Promise<import("mongoose").LeanDocument<import("../models/Instance.model").IInstanceModel & {
        _id: import("mongoose").Types.ObjectId;
    }>>;
    deleteMany(condition: any): Promise<import("mongodb").DeleteResult>;
    findByIdCondition(condition: any): Promise<import("mongoose").LeanDocument<import("../models/Instance.model").IInstanceModel & {
        _id: import("mongoose").Types.ObjectId;
    }>[]>;
    exists(id: any): Promise<{
        _id: any;
    }>;
}

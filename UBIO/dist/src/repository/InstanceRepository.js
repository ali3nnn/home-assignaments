"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Instance_model_1 = require("../models/Instance.model");
class InstanceRepository {
    findBy(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Instance_model_1.default.find({
                [key]: value
            }).lean();
        });
    }
    findById(instanceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Instance_model_1.default.findById(instanceId).lean();
        });
    }
    findByIdAndUpdate(instanceId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Instance_model_1.default.findByIdAndUpdate(instanceId, payload, { new: true }).lean();
        });
    }
    findAllByGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Instance_model_1.default.aggregate([
                { "$sort": { "createdAt": 1, "updatedAt": 1 } },
                {
                    "$group": {
                        "_id": "$group",
                        "instances": { "$sum": 1 },
                        "createdAt": { "$first": "$createdAt" },
                        "lastUpdatedAt": { "$last": "$updatedAt" } // Adding updateAt value from the latest pulse
                    }
                },
                {
                    $set: { group: "$_id" } // Creating the group key in the response
                },
                {
                    $project: { _id: 0 } // Hiding the _id from the response
                }
            ]);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Instance_model_1.default.find().lean();
        });
    }
    create(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Instance_model_1.default.create(payload);
        });
    }
    findByIdAndDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Instance_model_1.default.findByIdAndDelete(id).lean();
        });
    }
    deleteMany(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Instance_model_1.default.deleteMany(condition);
        });
    }
    findByIdCondition(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Instance_model_1.default.find(condition).lean();
        });
    }
    exists(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Instance_model_1.default.exists({ _id: id }).lean();
        });
    }
}
exports.default = InstanceRepository;

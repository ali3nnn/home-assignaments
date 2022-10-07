"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const dotenv = require("dotenv");
const tsyringe_1 = require("tsyringe");
const InstanceService_1 = require("../services/InstanceService");
dotenv.config();
let InstanceController = class InstanceController {
    constructor(service) {
        this.service = service;
    }
    processHeartbeats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, group, body } = this.service.paramsHandler(req);
            const isInstance = yield this.service.checkIfInstanceExists(id);
            if (isInstance) {
                try {
                    const updatedInstance = yield this.service.updateInstance(id, body);
                    return res.status(200).json(updatedInstance);
                }
                catch (e) {
                    return res.status(500).json({
                        message: e.message
                    });
                }
            }
            else {
                try {
                    const instance = yield this.service.createInstance(id, group, body);
                    return res.status(201).json(instance);
                }
                catch (e) {
                    return res.status(500).json({
                        message: e.message
                    });
                }
            }
        });
    }
    unregisterInstance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = this.service.paramsHandler(req);
            try {
                yield this.service.deleteInstance(id);
                return res.status(200).send();
            }
            catch (e) {
                return res.status(500).send({
                    message: e.message
                });
            }
        });
    }
    describeAllGroups(res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instances = yield this.service.aggregateGroups();
                return res.status(200).send(instances);
            }
            catch (e) {
                res.status(404).send({
                    message: e.message
                });
            }
        });
    }
    describeOneGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { group } = this.service.paramsHandler(req);
            try {
                const instances = yield this.service.findBy('group', group);
                return res.status(200).json(instances);
            }
            catch (e) {
                return res.status(404).send({
                    message: e.message
                });
            }
        });
    }
    removeExpiredInstances(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const threshold = Number(process.env.INSTANCE_EXPIRATION_DATE_SEC);
            const instanceIdsToDelete = yield this.service.deleteOldInstancesBy(threshold);
            const deletionPromises = instanceIdsToDelete.map(instance => this.service.deleteInstance(instance.id));
            Promise.allSettled(deletionPromises)
                .then(responses => { return res.status(200); })
                .catch(err => { return res.status(500).send(err); });
        });
    }
};
InstanceController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [InstanceService_1.default])
], InstanceController);
exports.default = InstanceController;

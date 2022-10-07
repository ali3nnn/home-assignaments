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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const InstanceRepository_1 = require("../repository/InstanceRepository");
let InstanceService = class InstanceService {
    constructor(instanceRepository) {
        this.instanceRepository = instanceRepository;
    }
    checkIfInstanceExists(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = yield this.instanceRepository.exists(id);
            return !!instance;
        });
    }
    findInstanceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = yield this.instanceRepository.findById(id);
            return this.cleanseTheResponse(instance);
        });
    }
    aggregateGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            const instances = yield this.instanceRepository.findAllByGroups();
            if (!instances) {
                throw new Error("No group found");
            }
            return instances;
        });
    }
    findBy(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const instances = yield this.instanceRepository.findBy(key, value);
            if (!instances.length) {
                throw new Error("No group found");
            }
            return this.cleanseTheResponse(instances);
        });
    }
    updateInstance(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = yield this.instanceRepository.findByIdAndUpdate(id, Object.assign({ updatedAt: Date.now() }, (Object.keys(body).length && { meta: body })));
            return this.cleanseTheResponse(instance);
        });
    }
    createInstance(id, group, body) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.instanceRepository.create(Object.assign({ _id: id, group }, (Object.keys(body).length && { meta: body })));
            const instance = yield this.instanceRepository.findById(id);
            return this.cleanseTheResponse(instance);
        });
    }
    deleteInstance(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = yield this.instanceRepository.findByIdAndDelete(id);
            // console.log(`Removed instance ${instance._id}`)
            if (!instance) {
                throw new Error('Request couldn\'t be completed');
            }
        });
    }
    deleteOldInstancesBy(threshold) {
        return __awaiter(this, void 0, void 0, function* () {
            const condition = {
                updatedAt: {
                    $lt: Date.now() - threshold * 1000
                }
            };
            const instancesToBeDeleted = yield this.instanceRepository.findByIdCondition(condition);
            instancesToBeDeleted.forEach(instance => console.log(`Instance ${instance._id} passed the expiration date with ${(Date.now() - threshold * 1000 - instance.updatedAt) / 1000} sec`));
            return this.cleanseTheResponse(instancesToBeDeleted);
        });
    }
    cleanseTheResponse(payload) {
        if (!payload) {
            return payload;
        }
        else if (Array.isArray(payload)) {
            const parsedPayload = payload.map((instance) => {
                return this.cleanseTheResponse(instance);
            });
            return parsedPayload;
        }
        else {
            const { _id } = payload, instanceData = __rest(payload, ["_id"]);
            const parsedObject = Object.assign({ id: _id }, instanceData);
            return parsedObject;
        }
    }
    paramsHandler(req) {
        var _a, _b;
        return Object.assign(Object.assign(Object.assign({}, (((_a = req.params) === null || _a === void 0 ? void 0 : _a.id) && { id: req.params.id })), (((_b = req.params) === null || _b === void 0 ? void 0 : _b.group) && { group: req.params.group })), (req.body && { body: req.body }));
    }
};
InstanceService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [InstanceRepository_1.default])
], InstanceService);
exports.default = InstanceService;

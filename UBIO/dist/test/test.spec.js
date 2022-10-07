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
require("reflect-metadata");
const globals_1 = require("@jest/globals");
const request = require("supertest");
const uuid_1 = require("uuid");
const app_1 = require("../src/app");
const db = require("../src/database");
// connecting to testing database
db.connect('ubio-testing');
(0, globals_1.describe)('REST Endpoints', () => {
    const group = "testing-group";
    const instanceId1 = (0, uuid_1.v4)();
    const instanceId2 = (0, uuid_1.v4)();
    const instanceId3 = (0, uuid_1.v4)();
    (0, globals_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
        // add dummy data into DB
        yield request(app_1.default).post(`/${group}/${instanceId1}`);
        yield request(app_1.default).post(`/${group}/${instanceId2}`);
    }));
    (0, globals_1.afterEach)(() => __awaiter(void 0, void 0, void 0, function* () {
        // delete dummy data from DB
        yield request(app_1.default).delete(`/${group}/${instanceId1}`);
        yield request(app_1.default).delete(`/${group}/${instanceId2}`);
        yield request(app_1.default).delete(`/${group}/${instanceId3}`);
    }));
    (0, globals_1.it)('should describe all groups', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app_1.default).get("/");
        (0, globals_1.expect)(response.status).toBe(200);
        (0, globals_1.expect)(response.body).toBeInstanceOf(Array);
        (0, globals_1.expect)(response.body.length).toBe(1);
        (0, globals_1.expect)(response.body[0].instances).toBe(2);
        (0, globals_1.expect)(Object.keys(response.body[0])).toEqual(["instances", "createdAt", "lastUpdatedAt", "group"]);
    }));
    (0, globals_1.it)('should update an instance', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app_1.default).post(`/${group}/${instanceId1}`);
        (0, globals_1.expect)(response.status).toBe(200);
        (0, globals_1.expect)(response.body.id).toBe(instanceId1);
    }));
    (0, globals_1.it)('should create an instance', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app_1.default).post(`/${group}/${instanceId3}`);
        (0, globals_1.expect)(response.status).toBe(201);
        (0, globals_1.expect)(response.body.id).toBe(instanceId3);
    }));
    (0, globals_1.it)('should unregister one instance', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app_1.default).delete(`/${group}/${instanceId2}`);
        (0, globals_1.expect)(response.status).toBe(200);
    }));
    (0, globals_1.it)('should describe one group', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app_1.default).get(`/${group}`);
        (0, globals_1.expect)(response.status).toBe(200);
        (0, globals_1.expect)(response.body.length).toBe(2);
        (0, globals_1.expect)(response.body).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                id: instanceId1,
                group
            }),
            globals_1.expect.objectContaining({
                id: instanceId2,
                group
            })
        ]));
    }));
});

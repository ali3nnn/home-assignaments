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
exports.instanceController = void 0;
require("reflect-metadata");
const express = require("express");
const tsyringe_1 = require("tsyringe");
const InstanceController_1 = require("./controllers/InstanceController");
const app = express();
// Express configuration
app.use(express.json());
// DI container
exports.instanceController = tsyringe_1.container.resolve(InstanceController_1.default);
// Rest Endpoints
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.instanceController.describeAllGroups(res);
}));
app.delete('/removeExpiredInstances', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.instanceController.removeExpiredInstances(res);
}));
app.post('/:group/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.instanceController.processHeartbeats(req, res);
}));
app.delete('/:group/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.instanceController.unregisterInstance(req, res);
}));
app.get('/:group', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.instanceController.describeOneGroup(req, res);
}));
exports.default = app;

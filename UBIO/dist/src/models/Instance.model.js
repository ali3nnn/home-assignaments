"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const InstanceSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
    versionKey: false
});
exports.default = mongoose_1.default.model('Instance', InstanceSchema);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = exports.connect = void 0;
const mongoose = require("mongoose");
const HOST = 'mongodb://localhost:27017/';
const connect = (database) => {
    return new Promise((resolve, reject) => {
        const URI = HOST + database;
        return mongoose.connect(URI, (err) => {
            if (!err) {
                console.log('Connected to', URI);
                resolve();
            }
            else {
                reject(err);
            }
        });
    });
};
exports.connect = connect;
const disconnect = () => {
    return mongoose.disconnect();
};
exports.disconnect = disconnect;
exports.default = mongoose;

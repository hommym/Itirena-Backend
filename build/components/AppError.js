"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
// this the main Error class All other error classes will inherit fromthis class
class AppError extends Error {
    constructor(msg) {
        //what ever argument passed into msg should be in the json format so that it converted from string in to an object
        super(msg);
        this.msg = msg;
    }
}
exports.AppError = AppError;

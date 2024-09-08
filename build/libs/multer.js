"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileInRequest = void 0;
const multer_1 = __importDefault(require("multer"));
const getFileInRequest = (fileFieldName) => {
    return (0, multer_1.default)().single(fileFieldName);
};
exports.getFileInRequest = getFileInRequest;

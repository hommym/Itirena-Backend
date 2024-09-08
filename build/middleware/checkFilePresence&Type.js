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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFilePresenceAndType = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const logger_1 = require("../components/logger");
const AppError_1 = require("../components/AppError");
const checkFilePresenceAndType = (mimeTypes) => {
    return (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        (0, logger_1.loger)("Checking if a file is present and is of the required type...");
        if (req.file && mimeTypes.includes(req.file.mimetype)) {
            (0, logger_1.loger)("File present and is of the required type");
            next();
        }
        else {
            (0, logger_1.loger)("Either file is not present or is not of the appropriate type.");
            res.status(400);
            throw new AppError_1.AppError(req.file ? `{"errType":"Request Error","message":"No File uploaded"}` : `{"errType":"Request Error","message":"File must be an image or pdf"}`);
        }
    }));
};
exports.checkFilePresenceAndType = checkFilePresenceAndType;

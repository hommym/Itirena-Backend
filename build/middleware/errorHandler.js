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
exports.errorHandler = void 0;
const AppError_1 = require("../components/AppError");
const errorHandler = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (err instanceof AppError_1.AppError) {
        if (err.statusCode)
            res.status(err.statusCode);
        try {
            // converting json in string form in json object
            const jsonErrorMessage = JSON.parse(err.msg);
            res.json(jsonErrorMessage);
        }
        catch (error) {
            res.json({ error: err.message });
        }
    }
    else if (err instanceof SyntaxError) {
        res.status(400).json({ error: err.message });
    }
    else {
        res.json({ error: err.message });
    }
});
exports.errorHandler = errorHandler;

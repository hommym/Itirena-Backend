"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.jwtForSignUp = exports.jwtForLogIn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtForLogIn = (id) => {
    if (process.env.JwtSecretKey !== undefined) {
        return jsonwebtoken_1.default.sign({ userId: id }, process.env.JwtSecretKey, { expiresIn: "1d" });
    }
    else {
        return null;
    }
};
exports.jwtForLogIn = jwtForLogIn;
const jwtForSignUp = (id, verfCode) => {
    if (process.env.JwtSecretKey !== undefined) {
        return jsonwebtoken_1.default.sign({ userId: id, code: verfCode }, process.env.JwtSecretKey, { expiresIn: "1hr" });
    }
    else {
        return null;
    }
};
exports.jwtForSignUp = jwtForSignUp;
const verifyToken = (token) => {
    try {
        if (process.env.JwtSecretKey !== undefined) {
            return jsonwebtoken_1.default.verify(token, process.env.JwtSecretKey);
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.log(error);
        return error;
    }
};
exports.verifyToken = verifyToken;

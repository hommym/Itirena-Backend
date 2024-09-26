"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loger = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// this component for logging stuff on the screen
//the flag component is for setting the level of importance of the log if is set to imp the message will be logged even if logger is turned off in env
const loger = (msg) => {
    if (process.env.loggerSwitch === "On") {
        console.log(msg);
    }
};
exports.loger = loger;

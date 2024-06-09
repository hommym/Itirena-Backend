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
exports.tObjectId = exports.connectToDatabase = void 0;
// importing required modules
const mongoose_1 = __importDefault(require("mongoose"));
// const mongoose = require("mongoose");
mongoose_1.default.connection.once("open", () => {
    console.log("Database connection successfully established");
});
mongoose_1.default.connection.on("error", (e) => {
    console.log(`An error occurred while connecting ${e.message}`);
});
const connectToDatabase = (connectionUrl) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof connectionUrl === "string") {
        yield mongoose_1.default.connect(connectionUrl);
    }
    else {
        console.log("Mongo Db connection url undefined");
    }
});
exports.connectToDatabase = connectToDatabase;
const tObjectId = (id) => {
    return new mongoose_1.default.Types.ObjectId(id);
};
exports.tObjectId = tObjectId;
// exports = { connectToDatabase, tObjectId };

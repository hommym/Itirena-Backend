"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// the userSchema
const userSchema = new mongoose_1.default.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    // norm for normal users and dev is for developers wanting to use my api's
    userType: {
        type: String,
        required: true,
        enum: ["norm", "dev"],
    },
    verfCode: {
        type: Number,
        default: 0,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
});
exports.UserSchema = mongoose_1.default.model("User", userSchema);

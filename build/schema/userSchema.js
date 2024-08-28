"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// method for getting current year 
function getCurrentYear() {
    const currentYear = new Date().getFullYear();
    return currentYear;
}
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
    verfCode: {
        type: Number,
        default: 0,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    academicYear: {
        type: String,
        default: `${getCurrentYear() - 1}/${getCurrentYear()}`
    },
    isClassTimeTablePresent: {
        type: Boolean,
        default: false
    }
});
exports.UserSchema = mongoose_1.default.model("User", userSchema);

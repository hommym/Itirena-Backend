"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// the courseSchema
const courseSchema = new mongoose_1.default.Schema({
    semester: {
        type: String,
        required: [true, "No data was passed fpr semester field in the request body"],
    },
    academicYear: {
        type: String,
        required: [true, "No data was passed for academicYear field in the request body"],
    },
    courses: {
        type: Array,
        required: [true, "No data passed for courses in request body"]
    },
});
exports.CourseSchema = mongoose_1.default.model("Course", courseSchema);

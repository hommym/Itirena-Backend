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
        enum: { values: [1, 2], message: "{VALUE} is not valid value for semester field. valid values = 1 or 2" },
        required: [true, "No data was passed fpr semester field in the request body"],
    },
    academicYear: {
        type: String,
        required: [true, "No data was passed for academicYear field in the request body"],
        match: [new RegExp("^\\d{4}/\\d{4}$"), "academicYearvalue is not value must be in this form yyyy/yyyy"],
    },
    courses: {
        type: Array,
        required: [true, "No data passed for courses in request body"],
    },
});
exports.CourseSchema = mongoose_1.default.model("Course", courseSchema);

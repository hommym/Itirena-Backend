"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// the courseSchema
const courseSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.Types.ObjectId
    },
    semester: {
        type: String,
        enum: { values: [1, 2], message: "{VALUE} is not valid value for semester field. valid values = 1 or 2" },
        required: [true, "No data was passed for semester field in the request body"],
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

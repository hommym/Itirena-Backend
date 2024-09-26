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
exports.timeTableInfoSaveController = exports.timeTableUploadController = exports.courseSlipInfoSaveController = exports.couseSlipUploadController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const logger_1 = require("../../components/logger");
const AppError_1 = require("../../components/AppError");
const userSchema_1 = require("../../schema/userSchema");
const googleGemini_1 = require("../../libs/googleGemini");
const courseSchema_1 = require("../../schema/courseSchema");
const mongoose_1 = require("../../libs/mongoose");
// helper methods
const ValidateDataFormat = (courseData) => {
    courseData.forEach((course) => {
        const { courseCode, courseName, credit } = course;
        if (!courseCode && !courseName && !credit)
            throw new AppError_1.AppError("item(s) in courses in the request body is not in the required format", 400);
    });
    return true;
};
exports.couseSlipUploadController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { buffer, mimetype } = req.file;
    const courseDataFromImage = JSON.parse(yield (0, googleGemini_1.getInfoFromCourseSlip)(buffer, mimetype));
    res.status(200).json(courseDataFromImage);
}));
exports.courseSlipInfoSaveController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, logger_1.loger)("Saving course data...");
    const { courses, semester, academicYear, id } = req.body;
    if (!courses || !semester || !academicYear)
        throw new AppError_1.AppError(`No data passed for ${!courses ? "courses" : !semester ? "semester" : "academicYear"}`, 400);
    // checking if the data sent is in th right format
    if (ValidateDataFormat(courses))
        yield courseSchema_1.CourseSchema.findOneAndUpdate({ userId: (0, mongoose_1.tObjectId)(id), semester, academicYear }, { $set: { userId: (0, mongoose_1.tObjectId)(id), courses, semester, academicYear } }, { upsert: true });
    (0, logger_1.loger)("Data saved");
    yield userSchema_1.UserSchema.findOneAndUpdate({ _id: (0, mongoose_1.tObjectId)(id) }, { $set: { isCourseSlipPresent: true } });
    res.status(201).json({ message: "Course Data saved sucessfully" });
}));
exports.timeTableUploadController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { buffer, mimetype } = req.file;
    const { id } = req.body;
    (0, logger_1.loger)("Checking if course slip is present");
    const accountInfo = yield userSchema_1.UserSchema.findById(id);
    if (!(accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.isCourseSlipPresent)) {
        res.status(400);
        throw new AppError_1.AppError("No course data found ,course data must be present before timeTable upload", 404);
    }
    const courses = (_a = (yield courseSchema_1.CourseSchema.findOne({ userId: (0, mongoose_1.tObjectId)(id) }))) === null || _a === void 0 ? void 0 : _a.courses;
    const timeTableDataFromImage = JSON.parse(yield (0, googleGemini_1.getInfoFromTimeTable)(buffer, mimetype, JSON.stringify(courses)));
    res.status(200).json(timeTableDataFromImage);
}));
exports.timeTableInfoSaveController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () { }));

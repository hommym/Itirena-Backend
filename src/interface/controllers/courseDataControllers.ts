import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { loger } from "../../@global/helpers/logger";
import { AppError } from "../../@global/customErrors/AppError";
import { UserSchema } from "../../infrastructure/database/schema/userSchema";
import { getInfoFromCourseSlip, getInfoFromTimeTable } from "../../libs/googleGemini";
import { Course } from "../../@global/customDataTypes/courseSlipDataType";
import { CourseSchema } from "../../infrastructure/database/schema/courseSchema";
import { tObjectId } from "../../libs/mongoose";

// helper methods
const ValidateDataFormat = (courseData: Array<Course>) => {
  courseData.forEach((course) => {
    const { courseCode, courseName, credit } = course;
    if (!courseCode && !courseName && !credit) throw new AppError("item(s) in courses in the request body is not in the required format", 400);
  });
  return true;
};

export const couseSlipUploadController = asyncHandler(async (req: Request, res: Response) => {
  const { buffer, mimetype } = req.file!;
  const courseDataFromImage = JSON.parse(await getInfoFromCourseSlip(buffer, mimetype));
  res.status(200).json(courseDataFromImage);
});

export const courseSlipInfoSaveController = asyncHandler(async (req: Request, res: Response) => {
  loger("Saving course data...");
  const { courses, semester, academicYear, id } = req.body;

  if (!courses || !semester || !academicYear) throw new AppError(`No data passed for ${!courses ? "courses" : !semester ? "semester" : "academicYear"}`, 400);

  // checking if the data sent is in th right format
  if (ValidateDataFormat(courses))
    await CourseSchema.findOneAndUpdate({ userId: tObjectId(id), semester, academicYear }, { $set: { userId: tObjectId(id), courses, semester, academicYear } }, { upsert: true });
  loger("Data saved");
  await UserSchema.findOneAndUpdate({ _id: tObjectId(id) }, { $set: { isCourseSlipPresent: true } });
  res.status(201).json({ message: "Course Data saved sucessfully" });
});

export const timeTableUploadController = asyncHandler(async (req: Request, res: Response) => {
  const { buffer, mimetype } = req.file!;
  const { id } = req.body;

  loger("Checking if course slip is present");
  const accountInfo = await UserSchema.findById(id);
  if (!accountInfo?.isCourseSlipPresent) {
    res.status(400);
    throw new AppError("No course data found ,course data must be present before timeTable upload", 404);
  }

  const courses = (await CourseSchema.findOne({ userId: tObjectId(id) }))?.courses;

  const timeTableDataFromImage = JSON.parse(await getInfoFromTimeTable(buffer, mimetype, JSON.stringify(courses)));
  res.status(200).json(timeTableDataFromImage);
});

export const timeTableInfoSaveController = asyncHandler(async (req: Request, res: Response) => {});

import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { loger } from "../../components/logger";
import { AppError } from "../../components/AppError";
import { UserSchema } from "../../schema/userSchema";
import { getInfoFromCourseSlip } from "../../libs/googleGemini";
import { Course, ModelJsonResponse } from "../../components/customDataTypes/courseSlipDataType";
import { CourseSchema } from "../../schema/courseSchema";
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
  let courseDataFromImage: ModelJsonResponse = JSON.parse(await getInfoFromCourseSlip(buffer, mimetype));
  res.status(200).json(courseDataFromImage);
});

export const courseSlipInfoSaveController = asyncHandler(async (req: Request, res: Response) => {
  loger("Saving course data...")
  const { courses, semester, academicYear, id } = req.body;

  if (!courses || !semester || !academicYear) throw new AppError(`No data passed for ${!courses ? "courses" : !semester ? "semester" : "academicYear"}`, 400);

  // checking if the data sent is in th right format
  if (ValidateDataFormat(courses)) await CourseSchema.findOneAndUpdate({ userId: tObjectId(id), semester, academicYear}, { $set: { userId: tObjectId(id), courses, semester, academicYear } },{upsert:true});
  loger("Data saved")
  res.status(201).json({ message: "Course Data saved sucessfully" });
});




export const timeTableUploadController = asyncHandler(async (req: Request, res: Response) => {
  const imgFile = req.file?.buffer;
  const { id } = req.body;

  loger("Checking if course slip is present");
  const accountInfo = await UserSchema.findById(id);
  if (!accountInfo?.isCourseSlipPresent) {
    res.status(400);
    throw new AppError(`{"errType":"Request Error","message":"No course slip for current year has been uploaded"}`);
  }

  // check database for course slip data and store in a variable

  // using the data in the course slip create the pompt you will e using

  // code to send image together with the prompt to gemni to extract the data in the image and put it in json

  // send the data from gemni back to the user for confirmation
});

export const timeTableInfoSaveController = asyncHandler(async (req: Request, res: Response) => {});

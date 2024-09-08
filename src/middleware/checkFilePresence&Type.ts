import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { loger } from "../components/logger";
import { AppError } from "../components/AppError";

export const checkFilePresenceAndType = (mimeTypes: Array<string>) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    loger("Checking if a file is present and is of the required type...");
    if (req.file && mimeTypes.includes(req.file.mimetype)) {
      loger("File present and is of the required type");
      next();
    } else {
      loger("Either file is not present or is not of the appropriate type.")
      res.status(400);
      throw new AppError(req.file ? `{"errType":"Request Error","message":"No File uploaded"}` : `{"errType":"Request Error","message":"File must be an image or pdf"}`);
    }
  });
};

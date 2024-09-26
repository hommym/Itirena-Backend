import { Request, Response, NextFunction } from "express";
import { AppError } from "../../@global/customErrors/AppError";
import { loger } from "../../@global/helpers/logger";

export const errorHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    if (err.statusCode) res.status(err.statusCode);
    try {
      // converting json in string form in json object
      const jsonErrorMessage = JSON.parse(err.msg);
      res.json(jsonErrorMessage);
    } catch (error) {
      res.json({ error: err.message });
    }
  } else if (err instanceof SyntaxError) {
    res.status(400).json({ error: err.message });
  } else {
    loger(err.message);
    res.status(500).json({ error: err.message });
  }
};

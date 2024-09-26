import { Request, Response, NextFunction } from "express";
import { UserSchema } from "../../infrastructure/database/schema/userSchema";
import { User } from "../../@global/customDataTypes/authDataTypes";
import { AppError } from "../../@global/customErrors/AppError";
import { loger } from "../../@global/helpers/logger";

export const verifyUserEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.email) {
      res.status(400);
      throw new AppError(`{"errType":"Request Error" ,"message":"No data passed for email in the body"}`);
    }

    // checking if an account with this email exist
    console.log("Checking if an email exist...");
    const accountsInDatabase: Array<User> = await UserSchema.find({ email: req.body.email });
    if (accountsInDatabase.length === 0) {
      console.log("No Account with this  email  exist");
      res.status(404);
      // if (!req.body.password) {
      //   throw new AppError(`{"errType":"Request Error" ,"message":"No data passed for password in the body"}`);
      // }
      throw new AppError(`{"errType":"Resource Not Found Error" ,"message":"No account with this email exist"}`);
    }

    loger("An account with user email exist");

    // setting id,accountVerification status and hashed passwords in the req.body for later use in the next middleware
    req.body.id = String(accountsInDatabase[0]._id);
    req.body.hashedPassword = accountsInDatabase[0].password;
    req.body.isVerified = accountsInDatabase[0].isVerified;
    // moving to the next middleware
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

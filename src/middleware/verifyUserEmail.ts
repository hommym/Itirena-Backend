import { Request, Response, NextFunction } from "express";
import { UserSchema } from "../schema/userSchema";
import { User } from "../components/customDataTypes/authDataTypes";

export const verifyUserEmail = async (req: Request, res: Response, next: NextFunction) => {
  console.log("A User is been Authenticated...");
  try {
    if (!req.body.email) {
      res.status(400);
      throw new Error("Bad request invalid request body");
    }

    // checking if an account with this email exist
    console.log("User email verification started ...")
    const accountsInDatabase: Array<User> = await UserSchema.find({ email: req.body.email });
    if (accountsInDatabase.length === 0) {
      console.log("No Account with this  email  exist");
      res.status(409);
      if(!req.body.password){
        throw new Error("No account with this email exist");
      }
      throw new Error("Invalid email and password");
    }

    
    console.log("An account with user email exist")

    // setting id and hashed passwords in the req.body for later use in the next middleware
    req.body.id = String(accountsInDatabase[0]._id);
    req.body.hashedPassword = accountsInDatabase[0].password

    // moving to the next middleware
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

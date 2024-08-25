// libs
import { UserSchema } from "../../schema/userSchema";
import bcrypt from "bcrypt";

// Custom data types
import { Request, Response, NextFunction } from "express";
import { User, loginCredentials } from "../../components/customDataTypes/authDataTypes";
import { sendConfirmationMessage, sendResetPasswordEmail } from "../../libs/nodemailer";
import { tObjectId } from "../../libs/mongoose";
import { jwtForLogIn } from "../../libs/jwt";
import asyncHandler from "express-async-handler";
import { AppError } from "../../components/AppError";
import { loger } from "../../components/logger";

export const signUpController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
   const { userName, email, password } = req.body;

   if (!userName || !email || !password) {
     res.status(400);
     throw new AppError(`{errType:"Request Error",message:"No data passed for ${(!userName)?"username":(!email)?"email":"password"} "}`);
   }

   const clientData: User = req.body;

   // hashing password
   clientData.password = await bcrypt.hash(clientData.password, 10);

   // checking if account already existed
   const accountsInDatabase: Array<User> = await UserSchema.find({ email: clientData.email });
   const accountsInDatabase2: Array<User> = await UserSchema.find({ userName: clientData.userName });

   // loger(userNamesInDatabase,workaccountsInDatabase)
   if (accountsInDatabase.length !== 0) {
     loger("Account creation failed email already exist");
     res.status(409).json({ message: "Account with this email already exist" });
   } else if (accountsInDatabase2.length !== 0) {
     loger("Account creation failed username already exist");
     res.status(409).json({ message: "Account with this username already exist" });
   } else {
     // saving data in database
     const savedDocument: User = await UserSchema.create(clientData);
     loger("account created successfully");
     req.body.user = savedDocument;

     // sending confirmation email
     await sendConfirmationMessage({ to: req.body.user.email, subject: "Itirena Account Confirmation Email" }, req.body.user._id);

     res.status(200).json({ message: "Account created succesfully check email to verify account" });
   }
})

export const accountConfirmationController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  await UserSchema.updateOne({ _id: tObjectId(req.body.id) }, { $set: { isVerified: true, verfCode: 0 } });
  res.status(200).json({ message: "User Account Verified successfully" });
})

export const loginController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
   const { password } = req.body;
   if (!password) {
     res.status(400);
     throw new Error("Bad request invalid request body");
   }
   const logInDetails: loginCredentials = req.body;

   loger("Checking if password is correct...");
   const isPasswordCorrect = await bcrypt.compare(logInDetails.password, req.body.hashedPassword);

   if (!isPasswordCorrect) {
     loger("Password Invalid");
     res.status(409);
     throw new Error("Invalid email and password");
   }
   loger("Password Correct");
   loger("User Authorized");
   // creating jwt for authorized use
   res.status(200).json({ message: "Login successful", token: jwtForLogIn(req.body.id) });
})

export const resetPasswordController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // sending account reset email
  await sendResetPasswordEmail({ to: req.body.email, subject: "Itirena Password Reset Email" }, req.body.id);
  res.status(200).json({ message: "Email sent click on the link to reset password" });
}
)
export const changePasswordController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { newPassword, oldPassword } = req.body;
  loger("A User is about to reset password");
   if (!newPassword) {
     res.status(400);
     throw new AppError(`errType:"Request Error", message:"No data passed for newPassword in the body"`);
   }
   // checking if there is an oldPassword to compare if is correct with the one in database in request
   if (req.url === "/change-password") {
     if (oldPassword) {
       loger("Checking if password is correct...");
       const userData = await UserSchema.findById(req.body.id);

       if (userData !== null) {
         const isPasswordCorrect = await bcrypt.compare(oldPassword, userData.password);

         if (!isPasswordCorrect) {
           loger("Password Invalid");
           res.status(409);
           throw new AppError(`errType:"Auth Error" ,message:"Incorrect password" `);
         }
         loger("Password correct");
       }
     } else {
       res.status(400);
       throw new AppError(`errType:"Request Error" , message:"No data passed for oldPassword in the body"`);
     }
   }

   // hashing new password
   loger("Hashing new passwprd....");
   const hashedPassword = await bcrypt.hash(newPassword, 10);
   loger("Password hashed");
   loger("Updating user password....");
   await UserSchema.updateOne({ _id: tObjectId(req.body.id) }, { $set: { password: hashedPassword } });

   loger("User password updated");

   res.status(200).json({ message: "User password updated successfully" });
}
)
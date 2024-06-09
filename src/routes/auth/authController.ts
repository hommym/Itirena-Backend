// libs
import { UserSchema } from "../../schema/userSchema";
import bcrypt from "bcrypt";

// Custom data types
import { Request, Response, NextFunction } from "express";
import { User, loginCredentials } from "../../components/customDataTypes/authDataTypes";
import { sendConfirmationMessage, sendResetPasswordEmail } from "../../libs/nodemailer";
import { tObjectId } from "../../libs/mongoose";
import { jwtForLogIn } from "../../libs/jwt";

export const signUpController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userName, email, password, userType } = req.body;

    if (!userName || !email || !password || !userType) {
      res.status(400);
      throw new Error("Incomplete body");
    }

    const clientData: User = req.body;

    // hashing password
    clientData.password = await bcrypt.hash(clientData.password, 10);

    // checking if account already existed
    const accountsInDatabase: Array<User> = await UserSchema.find({ email: clientData.email });

    // console.log(userNamesInDatabase,workaccountsInDatabase)
    if (accountsInDatabase.length !== 0) {
      res.status(409).json({ message: "Account with this email already exist" });
    } else {
      // saving data in database
      const savedDocument: User = await UserSchema.create(clientData);
      console.log("account created successfully");
      req.body.user = savedDocument;

      // sending confirmation email
      await sendConfirmationMessage({ to: req.body.user.email, subject: "Itirena Account Confirmation Email" }, req.body.user._id);

      res.status(200).json({ isAccountCreated: true });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const accountConfirmationController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // updating user data
    await UserSchema.updateOne({ _id: tObjectId(req.body.id) }, { $set: { isVerified: true, verfCode: 0 } });

    res.status(200).json({ message: "User Account Verified successfully" });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password } = req.body;
    if (!password) {
      res.status(400);
      throw new Error("Bad request invalid request body");
    }
    const logInDetails: loginCredentials = req.body;

    console.log("Checking if password is correct...");
    const isPasswordCorrect = await bcrypt.compare(logInDetails.password, req.body.hashedPassword);

    if (!isPasswordCorrect) {
      console.log("Password Invalid");
      res.status(409);
      throw new Error("Invalid email and password");
    }
    console.log("Password Correct");
    console.log("User Authorized");
    // creating jwt for authorized use
    res.status(200).json({ message: "Login successful", token: jwtForLogIn(req.body.id) });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // sending account reset email
    await sendResetPasswordEmail({ to: req.body.email, subject: "Itirena Password Reset Email" }, req.body.id);
    res.status(200).json({ message: "Email sent click on the link to reset password" });
  } catch (error) {
    next(error);
  }
};

export const changePasswordController = async (req: Request, res: Response, next: NextFunction) => {
  const { newPassword, oldPassword } = req.body;
  console.log("A User is about to reset password");
  try {
    if (!newPassword) {
      res.status(400);
      throw new Error("Bad request invalid request body,newPassword undefined");
    }
    // checking if there is an oldPassword to compare if is correct with the one in database in request
    if (req.url === "/change-password") {
      if (oldPassword) {
        console.log("Checking if password is correct...");
        const userData = await UserSchema.findById(req.body.id);

        if (userData !== null) {
          const isPasswordCorrect = await bcrypt.compare(oldPassword, userData.password);

          if (!isPasswordCorrect) {
            console.log("Password Invalid");
            res.status(409);
            throw new Error("Current password incorrect");
          }

          console.log("Password correct")

        }
      } else {
        res.status(400);
        throw new Error("Bad request invalid request body,oldPassword undefined");
      }
    }

    // hashing new password
    console.log("Hashing new passwprd....");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("Password hashed");
    console.log("Updating user password....");
    await UserSchema.updateOne({ _id: tObjectId(req.body.id) }, { $set: { password: hashedPassword } });

    console.log("User password updated");

    res.status(200).json({ message: "User password updated successfully" });
  } catch (error) {
    next(error);
  }
};

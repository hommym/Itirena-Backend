import nodeMailer from "nodemailer";
import dotenv from "dotenv";
import { mailObject } from "../@global/customDataTypes/authDataTypes";
import { Types } from "mongoose";
import { UserSchema } from "../infrastructure/database/schema/userSchema";
import { jwtForLogIn, jwtForSignUp } from "./jwt";
import { loger } from "../@global/helpers/logger";
dotenv.config();

const transporter = nodeMailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SmtpUserName,
    pass: process.env.SmtpSecret,
  },
});

export const sendConfirmationMessage = async (emailData: mailObject, id: Types.ObjectId) => {
  // creating confirmation message with onfirmation url
  const randomNumberForVerfCode = Math.floor(Math.random() * 9000) + 1000;

  // setting verfCode
  await UserSchema.updateOne({ _id: id }, { $set: { verfCode: randomNumberForVerfCode } });
  loger("Verfication code for account set..");

  //   setting message
  emailData.text = ` Hi thank you for registering for Itirena Account .\n\n The Four(4) digit verification code for your account confirmation is ${randomNumberForVerfCode}`;

  // sending mail
  await transporter.sendMail(emailData);
  loger("Confirmation email sent");
};

export const sendResetPasswordEmail = async (emailData: mailObject, id: string) => {
  //   setting message
  emailData.text = ` Hi to reset you MovieMania Account \n\n  please click the link below \n \n ${process.env.BaseUrl}/api/auth/reset-password/${jwtForLogIn(String(id))}`;

  // sending mail
  await transporter.sendMail(emailData);
  console.log("Password Reset email sent");
};

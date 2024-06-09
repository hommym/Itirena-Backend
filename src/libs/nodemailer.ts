import nodeMailer from "nodemailer";
import dotenv from "dotenv";
import { mailObject } from "../components/customDataTypes/authDataTypes";
import { Types } from "mongoose";
import { UserSchema } from "../schema/userSchema";
import { jwtForLogIn, jwtForSignUp } from "./jwt";
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
  const randomNumberForVerfCode = Math.floor(Math.random() * 90000) + 10000;

  // setting verfCode
  await UserSchema.updateOne({ _id: id }, { $set: { verfCode: randomNumberForVerfCode } });
  console.log("Verfication code for account set..");

//   setting message
  emailData.text = ` Hi thank you for registering for MovieMania Account \n\n To complete the account creation process please click the link below \n \n ${process.env.BaseUrl}/api/auth/account-confirmation/${jwtForSignUp(
    String(id),
    randomNumberForVerfCode
  )}`;

  
// sending mail
 await transporter.sendMail(emailData)
 console.log("Confirmation email sent")
};


export const sendResetPasswordEmail= async(emailData: mailObject,id:string)=>{
  //   setting message
  emailData.text = ` Hi to reset you MovieMania Account \n\n  please click the link below \n \n ${
    process.env.BaseUrl
  }/api/auth/reset-password/${jwtForLogIn(String(id))}`;

  // sending mail
  await transporter.sendMail(emailData);
  console.log("Password Reset email sent");
}
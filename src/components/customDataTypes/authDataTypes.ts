import mongoose, { Types } from "mongoose";

export type User = {
  readonly _id?: Types.ObjectId;
  userName: string;
  email: string;
  password: string;
  userType: string;
  phone?: string | null;
  isVerified?: boolean;
  verfCode?: number;
};

export type mailObject = {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export type loginCredentials = {
  email: string;
  password: string;
};

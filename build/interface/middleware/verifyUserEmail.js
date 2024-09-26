"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserEmail = void 0;
const userSchema_1 = require("../../infrastructure/database/schema/userSchema");
const AppError_1 = require("../../@global/customErrors/AppError");
const logger_1 = require("../../@global/helpers/logger");
const verifyUserEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.email) {
            res.status(400);
            throw new AppError_1.AppError(`{"errType":"Request Error" ,"message":"No data passed for email in the body"}`);
        }
        // checking if an account with this email exist
        console.log("Checking if an email exist...");
        const accountsInDatabase = yield userSchema_1.UserSchema.find({ email: req.body.email });
        if (accountsInDatabase.length === 0) {
            console.log("No Account with this  email  exist");
            res.status(404);
            // if (!req.body.password) {
            //   throw new AppError(`{"errType":"Request Error" ,"message":"No data passed for password in the body"}`);
            // }
            throw new AppError_1.AppError(`{"errType":"Resource Not Found Error" ,"message":"No account with this email exist"}`);
        }
        (0, logger_1.loger)("An account with user email exist");
        // setting id,accountVerification status and hashed passwords in the req.body for later use in the next middleware
        req.body.id = String(accountsInDatabase[0]._id);
        req.body.hashedPassword = accountsInDatabase[0].password;
        req.body.isVerified = accountsInDatabase[0].isVerified;
        // moving to the next middleware
        next();
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.verifyUserEmail = verifyUserEmail;

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordController = exports.resetPasswordController = exports.loginController = exports.accountConfirmationController = exports.signUpController = void 0;
// libs
const userSchema_1 = require("../../schema/userSchema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = require("../../libs/nodemailer");
const mongoose_1 = require("../../libs/mongoose");
const jwt_1 = require("../../libs/jwt");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const AppError_1 = require("../../components/AppError");
const logger_1 = require("../../components/logger");
exports.signUpController = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
        res.status(400);
        throw new AppError_1.AppError(`{"errType":"Request Error","message":"No data passed for ${(!userName) ? "username" : (!email) ? "email" : "password"} "}`);
    }
    const clientData = req.body;
    // hashing password
    clientData.password = yield bcrypt_1.default.hash(clientData.password, 10);
    // checking if account already existed
    const accountsInDatabase = yield userSchema_1.UserSchema.find({ email: clientData.email });
    const accountsInDatabase2 = yield userSchema_1.UserSchema.find({ userName: clientData.userName });
    // loger(userNamesInDatabase,workaccountsInDatabase)
    if (accountsInDatabase.length !== 0) {
        (0, logger_1.loger)("Account creation failed email already exist");
        res.status(409).json({ message: "Account with this email already exist" });
    }
    else if (accountsInDatabase2.length !== 0) {
        (0, logger_1.loger)("Account creation failed username already exist");
        res.status(409).json({ message: "Account with this username already exist" });
    }
    else {
        // saving data in database
        const savedDocument = yield userSchema_1.UserSchema.create(clientData);
        (0, logger_1.loger)("account created successfully");
        req.body.user = savedDocument;
        // sending confirmation email
        yield (0, nodemailer_1.sendConfirmationMessage)({ to: req.body.user.email, subject: "Itirena Account Confirmation Email" }, req.body.user._id);
        res.status(201).json({ message: "Account created succesfully check email to verify account" });
    }
}));
exports.accountConfirmationController = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, logger_1.loger)("A new account is been verified..");
    const { id, isVerified } = req.body;
    if (isVerified) {
        (0, logger_1.loger)("The Account has already been verified");
        res.status(201).json({ message: "Account has already been Verified" });
    }
    else {
        const account = yield userSchema_1.UserSchema.findOneAndUpdate({ _id: (0, mongoose_1.tObjectId)(id), verfCode: Number(req.params.verfCode) }, { $set: { isVerified: true, verfCode: 0 } });
        if (account) {
            res.status(201).json({ message: "Account Verified successfully" });
        }
        else {
            res.status(201).json({ message: "Verification code Incorrect Account Verification failed" });
        }
    }
}));
exports.loginController = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    if (!password) {
        res.status(400);
        throw new AppError_1.AppError(`{"errType":"Request Error" ,"message":"No data passed for password in the body"}`);
    }
    const logInDetails = req.body;
    (0, logger_1.loger)("Checking if password is correct...");
    const isPasswordCorrect = yield bcrypt_1.default.compare(logInDetails.password, req.body.hashedPassword);
    if (!isPasswordCorrect) {
        (0, logger_1.loger)("Password Invalid");
        res.status(409);
        throw new AppError_1.AppError(`{"errType":"Auth Error","message":"Invalid email and password"}`);
    }
    (0, logger_1.loger)("Password Correct");
    (0, logger_1.loger)("User Authorized");
    // creating jwt for authorized use
    res.status(201).json({ message: "Login successful", token: (0, jwt_1.jwtForLogIn)(req.body.id) });
}));
exports.resetPasswordController = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // sending account reset email
    yield (0, nodemailer_1.sendResetPasswordEmail)({ to: req.body.email, subject: "Itirena Password Reset Email" }, req.body.id);
    res.status(200).json({ message: "Email sent click on the link to reset password" });
}));
exports.changePasswordController = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword, oldPassword } = req.body;
    (0, logger_1.loger)("A User is about to reset password");
    if (!newPassword) {
        res.status(400);
        throw new AppError_1.AppError(`{"errType":"Request Error", "message":"No data passed for newPassword in the body"}`);
    }
    // checking if there is an oldPassword to compare if is correct with the one in database in request
    if (req.url === "/change-password") {
        if (oldPassword) {
            (0, logger_1.loger)("Checking if password is correct...");
            const userData = yield userSchema_1.UserSchema.findById(req.body.id);
            if (userData !== null) {
                const isPasswordCorrect = yield bcrypt_1.default.compare(oldPassword, userData.password);
                if (!isPasswordCorrect) {
                    (0, logger_1.loger)("Password Invalid");
                    res.status(409);
                    throw new AppError_1.AppError(`{"errType":"Auth Error" ,"message":"Incorrect password" }`);
                }
                (0, logger_1.loger)("Password correct");
            }
        }
        else {
            res.status(400);
            throw new AppError_1.AppError(`{"errType":"Request Error" , "message":"No data passed for oldPassword in the body"}`);
        }
    }
    // hashing new password
    (0, logger_1.loger)("Hashing new passwprd....");
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
    (0, logger_1.loger)("Password hashed");
    (0, logger_1.loger)("Updating user password....");
    yield userSchema_1.UserSchema.updateOne({ _id: (0, mongoose_1.tObjectId)(req.body.id) }, { $set: { password: hashedPassword } });
    (0, logger_1.loger)("User password updated");
    res.status(200).json({ message: "User password updated successfully" });
}));

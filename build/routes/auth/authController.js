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
const signUpController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email, password } = req.body;
        if (!userName || !email || !password) {
            res.status(400);
            throw new Error("Incomplete body");
        }
        const clientData = req.body;
        // hashing password
        clientData.password = yield bcrypt_1.default.hash(clientData.password, 10);
        // checking if account already existed
        const accountsInDatabase = yield userSchema_1.UserSchema.find({ email: clientData.email });
        const accountsInDatabase2 = yield userSchema_1.UserSchema.find({ userName: clientData.userName });
        // console.log(userNamesInDatabase,workaccountsInDatabase)
        if (accountsInDatabase.length !== 0) {
            console.log("Account creation failed email already exist");
            res.status(409).json({ message: "Account with this email already exist" });
        }
        else if (accountsInDatabase2.length !== 0) {
            console.log("Account creation failed username already exist");
            res.status(409).json({ message: "Account with this username already exist" });
        }
        else {
            // saving data in database
            const savedDocument = yield userSchema_1.UserSchema.create(clientData);
            console.log("account created successfully");
            req.body.user = savedDocument;
            // sending confirmation email
            yield (0, nodemailer_1.sendConfirmationMessage)({ to: req.body.user.email, subject: "Itirena Account Confirmation Email" }, req.body.user._id);
            res.status(200).json({ message: "Account created succesfully check email to verify account" });
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.signUpController = signUpController;
const accountConfirmationController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // updating user data
        yield userSchema_1.UserSchema.updateOne({ _id: (0, mongoose_1.tObjectId)(req.body.id) }, { $set: { isVerified: true, verfCode: 0 } });
        res.status(200).json({ message: "User Account Verified successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.accountConfirmationController = accountConfirmationController;
const loginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        if (!password) {
            res.status(400);
            throw new Error("Bad request invalid request body");
        }
        const logInDetails = req.body;
        console.log("Checking if password is correct...");
        const isPasswordCorrect = yield bcrypt_1.default.compare(logInDetails.password, req.body.hashedPassword);
        if (!isPasswordCorrect) {
            console.log("Password Invalid");
            res.status(409);
            throw new Error("Invalid email and password");
        }
        console.log("Password Correct");
        console.log("User Authorized");
        // creating jwt for authorized use
        res.status(200).json({ message: "Login successful", token: (0, jwt_1.jwtForLogIn)(req.body.id) });
    }
    catch (error) {
        next(error);
    }
});
exports.loginController = loginController;
const resetPasswordController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // sending account reset email
        yield (0, nodemailer_1.sendResetPasswordEmail)({ to: req.body.email, subject: "Itirena Password Reset Email" }, req.body.id);
        res.status(200).json({ message: "Email sent click on the link to reset password" });
    }
    catch (error) {
        next(error);
    }
});
exports.resetPasswordController = resetPasswordController;
const changePasswordController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                const userData = yield userSchema_1.UserSchema.findById(req.body.id);
                if (userData !== null) {
                    const isPasswordCorrect = yield bcrypt_1.default.compare(oldPassword, userData.password);
                    if (!isPasswordCorrect) {
                        console.log("Password Invalid");
                        res.status(409);
                        throw new Error("Current password incorrect");
                    }
                    console.log("Password correct");
                }
            }
            else {
                res.status(400);
                throw new Error("Bad request invalid request body,oldPassword undefined");
            }
        }
        // hashing new password
        console.log("Hashing new passwprd....");
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        console.log("Password hashed");
        console.log("Updating user password....");
        yield userSchema_1.UserSchema.updateOne({ _id: (0, mongoose_1.tObjectId)(req.body.id) }, { $set: { password: hashedPassword } });
        console.log("User password updated");
        res.status(200).json({ message: "User password updated successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.changePasswordController = changePasswordController;

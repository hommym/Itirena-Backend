"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
// libs and modules
const express_1 = require("express");
const authController_1 = require("./authController");
const verifyJwt_1 = require("../../middleware/verifyJwt");
const verifyUserEmail_1 = require("../../middleware/verifyUserEmail");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/signup", authController_1.signUpController);
exports.authRouter.post("/account-confirmation/:verfToken", verifyJwt_1.verifyJwt, authController_1.accountConfirmationController);
exports.authRouter.post("/login", verifyUserEmail_1.verifyUserEmail, authController_1.loginController);
exports.authRouter.post("/reset-account", verifyUserEmail_1.verifyUserEmail, authController_1.resetPasswordController);
exports.authRouter.put("/confirm-account-reset/:resetToken", verifyJwt_1.verifyJwt, authController_1.changePasswordController);
exports.authRouter.put("/change-password", verifyJwt_1.verifyJwt, authController_1.changePasswordController);

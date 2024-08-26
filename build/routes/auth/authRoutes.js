"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
// libs and modules
const express_1 = require("express");
const authController_1 = require("./authController");
const verifyJwt_1 = require("../../middleware/verifyJwt");
const verifyUserEmail_1 = require("../../middleware/verifyUserEmail");
exports.authRouter = (0, express_1.Router)();
/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     tags:
 *       - Account
 *     summary: Create a new user account
 *     description: This endpoint is used to create a new user account by providing an email, username, and password. The account is created only if the provided email and username are unique.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               userName:
 *                 type: string
 *                 example: "username123"
 *               password:
 *                 type: string
 *                 example: "securePassword"
 *             required:
 *               - email
 *               - userName
 *               - password
 *     responses:
 *       201:
 *         description: |
 *           Account created successfully.
 *           This status code indicates that the account has been created, and the user will receive an email to verify their account.
 *           The client should instruct the user to check their email and follow the verification steps.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account created successfully. Check email to verify account."
 *       409:
 *         description: |
 *           Conflict error.
 *           This status code is returned when the email or username provided already exists in the system.
 *           The client should inform the user to use a different email or username, as the ones provided are already taken.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account with this username or email already exists."
 *       400:
 *         description: |
 *           Bad Request.
 *           This status code indicates that the request was not properly formed, as one or more required fields (email, userName, password) were missing from the request body.
 *           The client should ensure all required fields are provided in the request and retry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errType:
 *                   type: string
 *                   example: "Request Error"
 *                 message:
 *                   type: string
 *                   example: "No data passed for email or userName or password."
 */
exports.authRouter.post("/signup", authController_1.signUpController);
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Account
 *     summary: User login endpoint
 *     description: This endpoint is used to authenticate a user by verifying their email and password. If the credentials are valid, the user is logged in and a JWT token is returned for session management.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "securePassword"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: |
 *           Login successful.
 *           This status code indicates that the email and password provided were correct.
 *           The client will receive a JWT token that should be used for authenticated requests.
 *           The client should store this token securely.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                   example: "jwtToken"
 *       409:
 *         description: |
 *           Authentication error.
 *           This status code is returned when the email or password provided is incorrect, or if no account exists for the email given.
 *           The client should prompt the user to check their credentials and try again.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errType:
 *                   type: string
 *                   example: "Auth Error"
 *                 message:
 *                   type: string
 *                   example: "Invalid email and password"
 *       400:
 *         description: |
 *           Bad Request.
 *           This status code indicates that the request was not properly formed, as one or more required fields (email, password) were missing from the request body.
 *           The client should ensure both the email and password fields are provided in the request and retry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errType:
 *                   type: string
 *                   example: "Request Error"
 *                 message:
 *                   type: string
 *                   example: "No data passed for password or email in the body."
 */
exports.authRouter.post("/login", verifyUserEmail_1.verifyUserEmail, authController_1.loginController);
exports.authRouter.post("/account-confirmation/:verfToken", verifyJwt_1.verifyJwt, authController_1.accountConfirmationController);
exports.authRouter.post("/reset-account", verifyUserEmail_1.verifyUserEmail, authController_1.resetPasswordController);
exports.authRouter.put("/confirm-account-reset/:resetToken", verifyJwt_1.verifyJwt, authController_1.changePasswordController);
exports.authRouter.put("/change-password", verifyJwt_1.verifyJwt, authController_1.changePasswordController);

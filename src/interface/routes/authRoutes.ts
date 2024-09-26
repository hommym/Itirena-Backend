// libs and modules
import { Router, Request, Response } from "express";
import { signUpController, accountConfirmationController, loginController, resetPasswordController, changePasswordController } from "../controllers/authController";
import { verifyJwt } from "../middleware/verifyJwt";
import { verifyUserEmail } from "../middleware/verifyUserEmail";

export const authRouter = Router();

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
authRouter.post("/signup", signUpController);

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
 *       404:
 *         description: |
 *           Resource Not Found.
 *           This status code is returned when no account with the provided email exists in the system.
 *           The client should inform the user that the email does not correspond to any account and suggest they verify the email address.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errType:
 *                   type: string
 *                   example: "Resource Not Found Error"
 *                 message:
 *                   type: string
 *                   example: "No account with this email exists"
 */
authRouter.post("/login", verifyUserEmail, loginController);

/**
 * @swagger
 * /api/v1/auth/account-confirmation/{verfCode}:
 *   post:
 *     tags:
 *       - Account
 *     summary: User account verification endpoint
 *     description: This endpoint is used to confirm a user's account by verifying the code sent in the confirmation email. The user must provide the verification code in the URL and include their email in the request body.
 *     parameters:
 *       - in: path
 *         name: verfCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The verification code sent to the user's email for account confirmation.
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
 *             required:
 *               - email
 *     responses:
 *       201:
 *         description: |
 *           Account verified successfully.
 *           This status code indicates that the verification code provided matched the one sent to the user's email, and the account has been successfully confirmed.
 *           If the account has already been verified, a different message will inform the client.
 *           If the verification code is incorrect, the account verification will fail, and an error message will be returned.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - properties:
 *                     message:
 *                       type: string
 *                       example: "Account Verified successfully"
 *                 - properties:
 *                     message:
 *                       type: string
 *                       example: "Account has already been Verified"
 *                 - properties:
 *                     message:
 *                       type: string
 *                       example: "Verification code Incorrect Account Verification failed"
 *       400:
 *         description: |
 *           Bad Request.
 *           This status code is returned when the email field is missing from the request body.
 *           The client should ensure that the email is provided and retry.
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
 *                   example: "No data passed for email in the body"
 *       404:
 *         description: |
 *           Resource Not Found.
 *           This status code is returned when no account with the provided email exists in the system.
 *           The client should inform the user that the email does not correspond to any account and suggest they verify the email address.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errType:
 *                   type: string
 *                   example: "Resource Not Found Error"
 *                 message:
 *                   type: string
 *                   example: "No account with this email exists"
 */
authRouter.post("/account-confirmation/:verfCode", verifyUserEmail, accountConfirmationController);

authRouter.post("/reset-account", verifyUserEmail, resetPasswordController);

authRouter.put("/confirm-account-reset/:resetToken", verifyJwt, changePasswordController);

authRouter.put("/change-password", verifyJwt, changePasswordController);

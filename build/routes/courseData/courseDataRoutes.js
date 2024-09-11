"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseDataRouter = void 0;
// libs and modules
const express_1 = require("express");
const verifyJwt_1 = require("../../middleware/verifyJwt");
const courseDataControllers_1 = require("./courseDataControllers");
const multer_1 = require("../../libs/multer");
const checkFilePresence_Type_1 = require("../../middleware/checkFilePresence&Type");
exports.courseDataRouter = (0, express_1.Router)();
/**
 * @swagger
 * /api/v1/course-data/course-slip/upload:
 *   post:
 *     tags:
 *       - Account
 *     summary: Extract course data from a course slip image
 *     description: This endpoint allows users to upload an image of a course slip to extract the course information. An Authorization header with a JWT token using the Bearer schema is required for the request.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               course-slip:
 *                 type: string
 *                 format: binary
 *                 description: The course slip image file to be uploaded
 *             required:
 *               - course-slip
 *     responses:
 *       200:
 *         description: |
 *           Data successfully extracted.
 *           This response indicates that the course data has been successfully extracted from the provided image.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data successfully extracted"
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseCode:
 *                         type: string
 *                         example: "CSE101"
 *                       courseName:
 *                         type: string
 *                         example: "Introduction to Computer Science"
 *                       credit:
 *                         type: number
 *                         example: 3
 *       400:
 *         description: |
 *           Bad Request.
 *           This status code indicates an issue with the request, such as:
 *           - The provided image is unclear or not a course slip.
 *           - No file was uploaded.
 *           - The file uploaded is not an image.
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
 *                   example: "The image is not clear or a course slip or No File uploaded or File must be an image"
 */
// endpoint for uploading course registration slip
exports.courseDataRouter.post("/course-slip/upload", (0, multer_1.getFileInRequest)("course-slip"), (0, checkFilePresence_Type_1.checkFilePresenceAndType)(["image/jpeg", "image/png", "application/pdf"]), verifyJwt_1.verifyJwt, courseDataControllers_1.couseSlipUploadController);
// endpoint for uploading timeTable
exports.courseDataRouter.post("/timeTable/upload", (0, multer_1.getFileInRequest)("timeTable"), (0, checkFilePresence_Type_1.checkFilePresenceAndType)(["image/jpeg", "image/png", "application/pdf"]), verifyJwt_1.verifyJwt, courseDataControllers_1.timeTableUploadController);
exports.courseDataRouter.post("/timeTable/save", verifyJwt_1.verifyJwt, courseDataControllers_1.timeTableInfoSaveController);
// endpoint for creating personal time table 
// endpoint for getting timeTable wheather class or personal one
// endpoint for sharing class or personal time tables with users

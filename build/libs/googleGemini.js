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
exports.getInfoFromCourseSlip = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generative_ai_1 = require("@google/generative-ai");
const logger_1 = require("../components/logger");
const AppError_1 = require("../components/AppError");
const getInfoFromCourseSlip = (file, mimeType) => __awaiter(void 0, void 0, void 0, function* () {
    let fileUri = "";
    let imgObject;
    const genAi = new generative_ai_1.GoogleGenerativeAI(process.env.GeminiApiKey);
    const promptForCheckingImageValidity = `1.For an image to be considered a course slip image , it needs to have or be
a. Clear with all the text capable of been seen . 
b. A known number of courses with their course-code present
c. the weight of each course present in the image(not always).
d. No time(like 9:00,7:00 etc) or day(like mon , monday etc) indications on the image
e.Should not have the word timeTable or anything relating to this word present in the image.

study the image above
Is the image above a course slip image?
If yes return {"isImageValid":true} and if false return {"isImageValid":false}`;
    const prompt = `
1.Extract  data from the image and it should be in this in the json format like {"message":"Data sucessfully extracted","courses":[{"courseCode":"data","coursName":"data","credit":"data(should be numeric)"}]

3.If data for course credit  is not present use 0 as their data`;
    //   converting img buffer into GoogleGenerativeAI.Part object
    (0, logger_1.loger)("The uploaded file is a img");
    (0, logger_1.loger)("Creating an img object to be used together with the prompt..");
    imgObject = { inlineData: { data: file.toString("base64"), mimeType } };
    (0, logger_1.loger)("Object Created");
    const model = genAi.getGenerativeModel({
        model: "gemini-1.5-pro",
        generationConfig: { temperature: 0, topP: 0.95, topK: 64, maxOutputTokens: 8192, responseMimeType: "application/json" },
        systemInstruction: "The response should only contain the json data.",
    });
    (0, logger_1.loger)("Checking if the image is valid first");
    let resultsFromModel = yield model.generateContent([imgObject, { text: promptForCheckingImageValidity }]);
    if (!(JSON.parse(resultsFromModel.response.text()).isImageValid)) {
        (0, logger_1.loger)("Image not valid");
        throw new AppError_1.AppError(`{"errType":"Request Error","message":"The image is not clear or a course slip"}`, 400);
    }
    (0, logger_1.loger)("Image valid");
    resultsFromModel = yield model.generateContent([imgObject, { text: prompt }]);
    (0, logger_1.loger)("Sending actual promt with the image..");
    (0, logger_1.loger)("Sent");
    (0, logger_1.loger)("Response received");
    return resultsFromModel.response.text();
});
exports.getInfoFromCourseSlip = getInfoFromCourseSlip;

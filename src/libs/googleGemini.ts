import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { loger } from "../components/logger";
import { AppError } from "../components/AppError";

const genAi = new GoogleGenerativeAI(process.env.GeminiApiKey!);
const model = genAi.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: { temperature: 0, topP: 0.95, topK: 64, maxOutputTokens: 8192, responseMimeType: "application/json" },
  systemInstruction: "The response should only contain the json data.",
});

export const getInfoFromCourseSlip = async (file: Buffer, mimeType: string) => {
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
  loger("The uploaded file is a img");
  loger("Creating an img object to be used together with the prompt..");
  const imgObject = { inlineData: { data: file.toString("base64"), mimeType } };
  loger("Object Created");

  loger("Checking if the image is valid first");
  let resultsFromModel = await model.generateContent([imgObject!, { text: promptForCheckingImageValidity }]);
  if (!JSON.parse(resultsFromModel.response.text()).isImageValid) {
    loger("Image not valid");
    throw new AppError(`The image is not clear or a course slip`, 400);
  }
  loger("Image valid");
  resultsFromModel = await model.generateContent([imgObject!, { text: prompt }]);
  loger("Sending actual promt with the image..");
  loger("Sent");
  loger("Response received");
  return resultsFromModel.response.text();
};

export const getInfoFromTimeTable = async (file: Buffer, mimeType: string,courses:string) => {
 const promptForCheckingImageValidity = `is this a timeTable?. If you think it is a timeTable return {isImageValid:true} and if you think is not return {isImageValid:false}`;

 const prompt = `Extract the data in the timeTable image base on this${courses} and return the data like this [{"day":"monday","startTime":"8:00","endTime":"9:55","course":"courseCode"}..]`;
  //   converting img buffer into GoogleGenerativeAI.Part object
  loger("The uploaded file is a img");
  loger("Creating an img object to be used together with the prompt..");
  const imgObject = { inlineData: { data: file.toString("base64"), mimeType } };
  loger("Object Created");


  loger("Checking if the image is valid first");
  let resultsFromModel = await model.generateContent([imgObject!, { text: promptForCheckingImageValidity }]);
  if (!JSON.parse(resultsFromModel.response.text()).isImageValid) {
    loger("Image not valid");
    throw new AppError("Image is not clear or is not a timeTable", 400);
  }
 loger("Image valid");
 resultsFromModel = await model.generateContent([imgObject!, { text: prompt }]);
 loger("Sending actual promt with the image..");
 loger("Sent");
 loger("Response received");
 return resultsFromModel.response.text();

};

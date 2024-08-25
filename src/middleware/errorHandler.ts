import {Request,Response,NextFunction} from "express"
import { AppError } from "../components/AppError";


export const errorHandler=async(err:Error,req:Request,res:Response,next:NextFunction)=>{

   try {
     if (res.statusCode >= 200 && res.statusCode < 400 && err instanceof AppError) {
       // converting json in string form in json object
       const jsonErrorMessage= JSON.parse(err.msg)
       res.json(jsonErrorMessage);
     } else {
       res.json({ error: err.message });
     }
    
   } catch (error) {
    res.json({error:"The message passed in AppError object is not in json format"})
   }


}
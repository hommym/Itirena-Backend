import {Request,Response,NextFunction} from "express"
import { AppError } from "../components/AppError";


export const errorHandler=async(err:Error,req:Request,res:Response,next:NextFunction)=>{

   try {
     if ( err instanceof AppError) {
      if (err.statusCode) {
        res.status(err.statusCode);
      }
       // converting json in string form in json object
       const jsonErrorMessage= JSON.parse(err.msg)
       
       res.json(jsonErrorMessage);
     } else {
       res.json({ error: err.message });
     }
    
   } catch (error) {
    res.json({error:err.message})
   }


}
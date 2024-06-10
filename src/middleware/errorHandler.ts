import {Request,Response,NextFunction} from "express"


export const errorHandler=async(err:Error,req:Request,res:Response,next:NextFunction)=>{

    if(res.statusCode>=200 && res.statusCode<400){
        res.json({message:err})
    }
    else{
        
        res.json({error:err.message})
    }


}
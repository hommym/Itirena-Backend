import multer from "multer" 

export const getFileInRequest= (fileFieldName:string)=>{
    return multer().single(fileFieldName)
}
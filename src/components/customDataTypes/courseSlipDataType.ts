

export interface Course{
courseCode:string;
courseName:string;
credit:number

}


export interface ModelJsonResponse{
    isImageValid:boolean;
    message:string,
    courses:Array<Course>
}

export interface CourseData{
semester:string;
academicYear:string;
courses:Array<Course>
}
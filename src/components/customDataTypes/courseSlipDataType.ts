

export interface Course{
courseCode:string;
courseName:string;
credit:number

}


export interface CourseData{
semester:string;
academicYear:string;
courses:Array<Course>
}
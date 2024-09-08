import mongoose, { Types } from "mongoose";
import { Course, CourseData } from "../components/customDataTypes/courseSlipDataType";





// the courseSchema
const courseSchema = new mongoose.Schema({
  semester: {
    type: String,
    required: [true, "No data was passed fpr semester field in the request body"],
  },
  academicYear: {
    type: String,
    required: [true, "No data was passed for academicYear field in the request body"],
  },
  courses: {
    type: Array,
    required:[true,"No data passed for courses in request body"]
  },
});


export const CourseSchema = mongoose.model("Course", courseSchema);



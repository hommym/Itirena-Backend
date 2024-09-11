import mongoose, { Types } from "mongoose";
import { Course, CourseData } from "../components/customDataTypes/courseSlipDataType";





// the courseSchema
const courseSchema = new mongoose.Schema({
  semester: {
    type: String,
    enum: { values: [1, 2], message: "{VALUE} is not valid value for semester field. valid values = 1 or 2" },
    required: [true, "No data was passed fpr semester field in the request body"],
  },
  academicYear: {
    type: String,
    required: [true, "No data was passed for academicYear field in the request body"],
    match: [new RegExp("^\\d{4}/\\d{4}$"), "academicYearvalue is not value must be in this form yyyy/yyyy"],
  },
  courses: {
    type: Array,
    required: [true, "No data passed for courses in request body"],
  },
});


export const CourseSchema = mongoose.model("Course", courseSchema);



import mongoose from "mongoose";

// method for getting current year 
export function getCurrentYear(): number {
  const currentYear = new Date().getFullYear();
  return currentYear;
}
// the userSchema
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  verfCode: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  academicYear:{
    type:String,
    default:`${getCurrentYear()-1}/${getCurrentYear()}`
  },
  programOfStudy:String,
  currentSemester:Number,
  isClassTimeTablePresent:{
    type:Boolean,
    default:false
  },
  isCourseSlipPresent:{
    type:Boolean,
    default:false 
  },
});

export const UserSchema = mongoose.model("User", userSchema);

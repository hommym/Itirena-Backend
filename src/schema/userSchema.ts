import mongoose from "mongoose";

// method for getting current year 
function getCurrentYear(): number {
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
  isClassTimeTablePresent:{
    type:Boolean,
    default:false
  }
});

export const UserSchema = mongoose.model("User", userSchema);

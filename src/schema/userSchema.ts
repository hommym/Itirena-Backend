import mongoose from "mongoose";

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

  phone: {
    type: String,
  },
  // norm for normal users and dev is for developers wanting to use my api's
 
  verfCode: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

export const UserSchema = mongoose.model("User", userSchema);

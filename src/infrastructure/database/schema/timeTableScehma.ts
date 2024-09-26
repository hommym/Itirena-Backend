import mongoose, { Types } from "mongoose";
import { TimeTable } from "../../../@global/customDataTypes/timeTableDataTypes";

// the timeTableSchema
const timeTableSchema = new mongoose.Schema<TimeTable>({
  userId: Types.ObjectId,
  timeTableType: {
    type: String,
    enum: ["class", "personal"],
  },
  events: Array,
  semester: String,
  academicYear: String,
});

export const TimeTableSchema = mongoose.model("TimeTable", timeTableSchema);

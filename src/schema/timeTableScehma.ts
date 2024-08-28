import mongoose,{Types} from "mongoose";
import { TimeTable } from "../components/customDataTypes/timeTableDataTypes";

// the timeTableSchema
const timeTableSchema = new mongoose.Schema<TimeTable>({
  userId:Types.ObjectId,
  timeTableType: {
    type:String,
    enum:["class","personal"]
  },
  events:Array  
});


export const TimeTableSchema=  mongoose.model("TimeTable",timeTableSchema)

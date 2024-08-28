import { Types } from "mongoose";

export interface Event {
  day: string;
  startTime: string;
  endTime: string;
  courseCode: string;
}

export interface TimeTable {
  userId: Types.ObjectId;
  timeTableType: string;
  events: Array<Event>;
}

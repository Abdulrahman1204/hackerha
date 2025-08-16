import { Document, Types } from "mongoose";

export interface IComment extends Document {
  courseId: Types.ObjectId;
  studentId: Types.ObjectId;
  text: string;
  rating: number;
}

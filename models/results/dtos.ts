import { Document, Types } from "mongoose";

export interface IResult extends Document {
  studentId: Types.ObjectId;
  total: number;
  questionNum: number;
  numOfWrong: number;
  numOfRight: number;
  time: string;
}

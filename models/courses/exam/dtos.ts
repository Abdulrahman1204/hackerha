import { Document, Types } from "mongoose";

export interface IExam  extends Document {
    courseId: Types.ObjectId;
    title: string;
    duration: string;
}
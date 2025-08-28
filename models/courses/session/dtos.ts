import { Document, Types } from "mongoose";

export interface ISession extends Document {
  courseId: Types.ObjectId;
  video: string;
  name: string;
  likes: Types.ObjectId[]; // likes from students
  disLikes: Types.ObjectId[]; // disLikes from students
  note: string;
  files: {
    url: string;
    name: string;
    type: string;
  }[];
  duration: string;
}

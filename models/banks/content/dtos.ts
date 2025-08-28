import { Document, Types } from "mongoose";

export interface IContent extends Document {
  bank: Types.ObjectId;
  title: string;
  duration: string;
}

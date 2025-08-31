import { Document, Types } from "mongoose";

export interface IAnswer extends Document {
  title: string;
  correct: boolean;
}

export interface IRequest extends Document {
  questionId: Types.ObjectId;
  text: string;
  image?: string;
  answers: IAnswer[];
}

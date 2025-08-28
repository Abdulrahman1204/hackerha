// interface
import { Document, Types } from "mongoose";

export interface IAnswer extends Document {
  title: string;
  correct: boolean;
}

export interface IRequest extends Document {
  text: string;
  image?: string;
  answers: IAnswer[];
}

export interface IQuestion extends Document {
  examId: Types.ObjectId;
  text: string;
  image?: string;
  requests: IRequest[];
}
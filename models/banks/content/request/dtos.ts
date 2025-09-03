import { Document, Types } from "mongoose";

export interface IAnswerBank extends Document {
  title: string;
  correct: boolean;
}

export interface IRequestBank extends Document {
  questionBankId: Types.ObjectId;
  text: string;
  image?: string;
  answers: IAnswerBank[];
}

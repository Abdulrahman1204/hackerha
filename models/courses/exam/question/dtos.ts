import { Document, Types } from "mongoose";

export interface IQuestion extends Document {
  examId: Types.ObjectId;
  text: string;
  image?: string;
  requests: [
    {
      text: string;
      answers: [
        {
          title: string;
          currect: boolean;
        }
      ];
    }
  ];
}

import { Document, Types } from "mongoose";

export interface IQuestionBank extends Document {
  contentId: Types.ObjectId;
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

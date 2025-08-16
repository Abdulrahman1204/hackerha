import { Document, Types } from "mongoose";

export interface ICourse extends Document {
  image: string;
  name: string;
  description: string;
  price: number;
  note: string;
  type: "نظري" | "عملي";
  discount: {
    dis: boolean;
    rate: number;
  };
  year: number;
  semester: number;
  rating: number;
  about: string;
  video: string;
  free: boolean;
}

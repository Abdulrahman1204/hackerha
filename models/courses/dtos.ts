import { Document, Types } from "mongoose";

export interface ICourse extends Document {
  image: string;
  name: string;
  description: string;
  price: number;
  note: string;
  type: "نظري" | "عملي" | "شاملة";
  discount: {
    dis: boolean;
    rate: number;
  };
  year: "سنة اولى" | "سنة ثانية" | "سنة ثالثة" | "سنة الرابعة" | "سنة الخامسة";
  semester: "فصل اول" | "فصل ثاني";
  rating: number;
  about: string;
  video: string;
  free: boolean;
}

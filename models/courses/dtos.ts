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
  year: "السنة الأولى" | "السنة الثانية" | "السنة الثالثة" | "السنة الرابعة" | "السنة الخامسة";
  semester: "الفصل الأول" | "الفصل الثاني";
  rating: number;
  about: string;
  video: string;
  free: boolean;
}

import { Document } from "mongoose";

export interface IBanks extends Document {
  image: string;
  title: string;
  year:
    | "السنة الأولى"
    | "السنة ثانية"
    | "السنة ثالثة"
    | "السنة الرابعة"
    | "السنة الخامسة";
  semester: "الفصل الأول" | "الفصل الثاني";
  free: true;
  available: boolean;
}

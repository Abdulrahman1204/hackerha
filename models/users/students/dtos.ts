import { Document, Types } from "mongoose";

export interface IStudent extends Document {
  profilePhoto: string;
  userName: string;
  phoneNumber: string;
  academicYear:
    | "السنة الأولى"
    | "السنة الثانية"
    | "السنة الثالثة"
    | "السنة الرابعة"
    | "السنة الخامسة";
  universityNumber: number;
  gender: "ذكر" | "انثى";
  birth: Date;
  email: string;
  password: string;
  otp: string;
  available: boolean;
  suspended: boolean;
  resetPass: boolean;
  suspensionReason: string;
  suspensionEnd: Date;
  favoriteCourses: Types.ObjectId[];
  favoriteSessions: Types.ObjectId[];
  favoriteBank: Types.ObjectId[];
  enrolledCourses: Types.ObjectId[];
  banks: Types.ObjectId[];
  contents: Types.ObjectId[];
}

export interface IOtp extends Document {
  otp: string;
}

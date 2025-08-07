import { Document, Types } from "mongoose";

export interface IStudent extends Document {
  profilePhoto: string;
  userName: string;
  phoneNumber: string;
  university: "جامعة قرطبة" | "جامعة إيبلا" | "جامعة الشهباء" | "جامعة حلب";
  academicYear: Date;
  universityNumber: number;
  birth: Date;
  email: string;
  password: string;
  otp: string;
  available: boolean;
  suspended: boolean;
  resetPass: boolean;
  suspensionReason: string;
  suspensionEnd: Date;
}

export interface IOtp extends Document {
  otp: string;
}

export interface IProfilePhoto extends Document {
  profilePhoto: { url: string; publicId: string | null };
}

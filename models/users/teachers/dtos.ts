import { Document } from "mongoose";

export interface ITeacher extends Document {
  profilePhoto: string;
  userName: string;
  phoneNumber: string;
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
}

export interface IOtp extends Document {
  otp: string;
}

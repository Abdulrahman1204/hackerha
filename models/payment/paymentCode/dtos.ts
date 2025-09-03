import { Document, Types } from "mongoose";

export interface IPaymentCode extends Document {
  code: string;
  universityNumber: number;
  courseId: Types.ObjectId | string;
  studentId?: Types.ObjectId | string;
  used: boolean;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
  compareCode(candidateCode: string): Promise<boolean>;
}
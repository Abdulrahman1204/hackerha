import { Document, Types } from "mongoose";

export interface IEnrollment extends Document {
  studentId: Types.ObjectId;
  courseId: Types.ObjectId;
  enrolledAt: Date;
  paymentCode: string;
}

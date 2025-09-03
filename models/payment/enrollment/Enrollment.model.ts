import mongoose, { Schema, Model, Types } from "mongoose";
import { IEnrollment } from "./dtos";

// Enrollment Schema
const EnrollmentSchema = new Schema<IEnrollment>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "معرف الطالب مطلوب"],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "معرف الكورس مطلوب"],
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    paymentCode: {
      type: String,
      required: [true, "كود الدفع مطلوب"],
    },
  },
  { timestamps: true }
);

// Prevent duplicate enrollments
EnrollmentSchema.index({ createdAt: -1 });

// Enrollment Model
const Enrollment: Model<IEnrollment> = mongoose.model<IEnrollment>(
  "Enrollment",
  EnrollmentSchema
);

export { Enrollment };
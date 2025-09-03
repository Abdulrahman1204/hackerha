import mongoose, { Schema, Model } from "mongoose";
import joi from "joi";
import { IExam } from "./dtos";

// Exam Schema
const ExamSchema = new Schema<IExam>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "معرف الكورس مطلوب"],
    },
    title: {
      type: String,
      required: [true, "عنوان الامتحان مطلوب"],
      trim: true,
      maxlength: [100, "العنوان يجب ألا يتجاوز 100 حرف"],
    },
    duration: {
      type: String,
      required: [true, "مدة الفيديو مطلوبة"],
    },
  },
  { timestamps: true }
);

// Exam Model
const Exam: Model<IExam> = mongoose.model<IExam>("Exam", ExamSchema);

// Indexes
ExamSchema.index({ courseId: 1 });
ExamSchema.index({ createdAt: -1 });

// Validation: Create Exam
const validateCreateExam = (obj: IExam): joi.ValidationResult => {
  const schema = joi.object({
    courseId: joi.string().required().messages({
      "string.empty": "معرف الكورس مطلوب",
      "any.required": "معرف الكورس مطلوب",
    }),
    title: joi.string().max(100).required().messages({
      "string.empty": "عنوان الامتحان مطلوب",
      "string.max": "العنوان يجب ألا يتجاوز 100 حرف",
      "any.required": "عنوان الامتحان مطلوب",
    }),
    duration: joi.string().required().min(1).messages({
      "string.empty": "مدة الفيديو مطلوبة",
      "any.required": "مدة الفيديو مطلوبة",
    }),
  });

  return schema.validate(obj);
};

// Validation: Update Exam
const validateUpdateExam = (obj: Partial<IExam>): joi.ValidationResult => {
  const schema = joi.object({
    courseId: joi.string().messages({
      "string.empty": "معرف الكورس مطلوب",
      "any.required": "معرف الكورس مطلوب",
    }),
    title: joi.string().max(100).messages({
      "string.empty": "عنوان الامتحان مطلوب",
      "string.max": "العنوان يجب ألا يتجاوز 100 حرف",
    }),
    duration: joi.string().min(1).messages({
      "string.empty": "مدة الفيديو مطلوبة",
      "any.required": "مدة الفيديو مطلوبة",
    }),
  });

  return schema.validate(obj);
};

export { Exam, validateCreateExam, validateUpdateExam };

import mongoose, { Schema, Model } from "mongoose";
import joi from "joi";
import { ISession } from "./dtos";

// Session Schema
const SessionSchema = new Schema<ISession>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "الكورس مطلوب"],
    },
    video: {
      type: String,
      required: [true, "رابط الفيديو مطلوب"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "اسم الجلسة مطلوب"],
      trim: true,
      maxlength: [100, "الاسم يجب ألا يتجاوز 100 حرف"],
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    disLikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    note: {
      type: String,
      trim: true,
      maxlength: [500, "الملاحظات يجب ألا تتجاوز 500 حرف"],
    },
    files: [
      {
        url: { type: String, required: true },
        name: { type: String, required: true },
        type: { type: String, required: true },
      },
    ],
    duration: {
      type: String,
      required: [true, "مدة الفيديو مطلوبة"],
    },
  },
  { timestamps: true }
);

// Session Model
const Session: Model<ISession> = mongoose.model<ISession>(
  "Session",
  SessionSchema
);

// Session Indexes
SessionSchema.index({ courseId: 1 });
SessionSchema.index({ createdAt: -1 });

// Validation: Create Session
const validateCreateSession = (obj: ISession): joi.ValidationResult => {
  const schema = joi.object({
    courseId: joi.string().required().messages({
      "string.empty": "الكورس مطلوب",
      "any.required": "الكورس مطلوب",
    }),
    video: joi.string().required().messages({
      "string.empty": "رابط الفيديو مطلوب",
      "any.required": "رابط الفيديو مطلوب",
    }),
    name: joi.string().max(100).required().messages({
      "string.empty": "اسم الجلسة مطلوب",
      "string.max": "الاسم يجب ألا يتجاوز 100 حرف",
      "any.required": "اسم الجلسة مطلوب",
    }),
    note: joi.string().max(500).messages({
      "string.max": "الملاحظات يجب ألا تتجاوز 500 حرف",
    }),
    files: joi
      .array()
      .items(
        joi.object({
          url: joi.string().uri().required().messages({
            "string.empty": "رابط الملف مطلوب",
            "string.uri": "يجب أن يكون رابط الملف صالحاً",
            "any.required": "رابط الملف مطلوب",
          }),
          name: joi.string().required().messages({
            "string.empty": "اسم الملف مطلوب",
            "any.required": "اسم الملف مطلوب",
          }),
          type: joi
            .string()
            .valid(
              "pdf",
              "doc",
              "docx",
              "xls",
              "xlsx",
              "ppt",
              "pptx",
              "jpg",
              "jpeg",
              "png",
              "mp4",
              "avi",
              "mov"
            )
            .required()
            .messages({
              "string.empty": "نوع الملف مطلوب",
              "any.only": "نوع الملف غير مدعوم",
              "any.required": "نوع الملف مطلوب",
            }),
        })
      )
      .messages({
        "array.base": "يجب أن تكون الملفات مصفوفة من الكائنات",
      }),
    duration: joi.string().required().min(1).messages({
      "string.empty": "مدة الفيديو مطلوبة",
      "any.required": "مدة الفيديو مطلوبة",
    }),
  });

  return schema.validate(obj);
};

// Validation: Update Session
const validateUpdateSession = (
  obj: Partial<ISession>
): joi.ValidationResult => {
  const schema = joi.object({
    courseId: joi.string().messages({
      "string.empty": "الكورس مطلوب",
      "any.required": "الكورس مطلوب",
    }),
    video: joi.string().messages({
      "string.empty": "رابط الفيديو مطلوب",
    }),
    name: joi.string().max(100).messages({
      "string.empty": "اسم الجلسة مطلوب",
      "string.max": "الاسم يجب ألا يتجاوز 100 حرف",
    }),
    note: joi.string().max(500).messages({
      "string.max": "الملاحظات يجب ألا تتجاوز 500 حرف",
    }),
    files: joi
      .array()
      .items(
        joi.object({
          url: joi.string().uri().required().messages({
            "string.empty": "رابط الملف مطلوب",
            "string.uri": "يجب أن يكون رابط الملف صالحاً",
            "any.required": "رابط الملف مطلوب",
          }),
          name: joi.string().required().messages({
            "string.empty": "اسم الملف مطلوب",
            "any.required": "اسم الملف مطلوب",
          }),
          type: joi
            .string()
            .valid(
              "pdf",
              "doc",
              "docx",
              "xls",
              "xlsx",
              "ppt",
              "pptx",
              "jpg",
              "jpeg",
              "png",
              "mp4",
              "avi",
              "mov"
            )
            .required()
            .messages({
              "string.empty": "نوع الملف مطلوب",
              "any.only": "نوع الملف غير مدعوم",
              "any.required": "نوع الملف مطلوب",
            }),
        })
      )
      .messages({
        "array.base": "يجب أن تكون الملفات مصفوفة من الكائنات",
      }),
    duration: joi.string().min(1).messages({
      "string.empty": "مدة الفيديو مطلوبة",
      "any.required": "مدة الفيديو مطلوبة",
    }),
  });

  return schema.validate(obj);
};

export { Session, validateCreateSession, validateUpdateSession };

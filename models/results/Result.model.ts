import mongoose, { Schema, Model, Types } from "mongoose";
import joi from "joi";
import { IResult } from "./dtos";

// Result Schema
const ResultSchema = new Schema<IResult>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "معرف الطالب مطلوب"],
    },
    total: {
      type: Number,
      required: [true, "المجموع الكلي مطلوب"],
      min: [0, "المجموع الكلي لا يمكن أن يكون سالباً"],
    },
    questionNum: {
      type: Number,
      required: [true, "عدد الأسئلة مطلوب"],
      min: [1, "يجب أن يكون هناك سؤال واحد على الأقل"],
    },
    numOfWrong: {
      type: Number,
      required: [true, "عدد الإجابات الخاطئة مطلوب"],
      min: [0, "عدد الإجابات الخاطئة لا يمكن أن يكون سالباً"],
    },
    numOfRight: {
      type: Number,
      required: [true, "عدد الإجابات الصحيحة مطلوب"],
      min: [0, "عدد الإجابات الصحيحة لا يمكن أن يكون سالباً"],
    },
    time: {
      type: String,
      required: [true, "الوقت المستغرق مطلوب"],
      validate: {
        validator: (v: string) =>
          /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$|^[0-5]?[0-9]:[0-5][0-9]$/.test(
            v
          ),
        message: "يجب أن يكون الوقت بصيغة صحيحة (مثال: 05:30 أو 01:25:45)",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Result Model
const Result: Model<IResult> = mongoose.model<IResult>("Result", ResultSchema);

// Result Indexes
ResultSchema.index({ createdAt: -1 });
ResultSchema.index({ studentId: 1 });
ResultSchema.index({ total: -1 });

// Validation Create Result
const validateCreateResult = (obj: IResult): joi.ValidationResult => {
  const schema = joi.object({
    studentId: joi.string().required().messages({
      "string.empty": "معرف الطالب مطلوب",
      "any.required": "معرف الطالب مطلوب",
    }),
    total: joi.number().min(0).required().messages({
      "number.min": "المجموع الكلي لا يمكن أن يكون سالباً",
      "any.required": "المجموع الكلي مطلوب",
    }),
    questionNum: joi.number().min(1).required().messages({
      "number.min": "يجب أن يكون هناك سؤال واحد على الأقل",
      "any.required": "عدد الأسئلة مطلوب",
    }),
    numOfWrong: joi.number().min(0).required().messages({
      "number.min": "عدد الإجابات الخاطئة لا يمكن أن يكون سالباً",
      "any.required": "عدد الإجابات الخاطئة مطلوب",
    }),
    numOfRight: joi.number().min(0).required().messages({
      "number.min": "عدد الإجابات الصحيحة لا يمكن أن يكون سالباً",
      "any.required": "عدد الإجابات الصحيحة مطلوب",
    }),
    time: joi
      .string()
      .pattern(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$|^[0-5]?[0-9]:[0-5][0-9]$/
      )
      .required()
      .messages({
        "string.empty": "الوقت المستغرق مطلوب",
        "any.required": "الوقت المستغرق مطلوب",
        "string.pattern.base":
          "يجب أن يكون الوقت بصيغة صحيحة (مثال: 05:30 أو 01:25:45)",
      }),
  });

  return schema.validate(obj);
};

// Validation Update Result
const validateUpdateResult = (obj: Partial<IResult>): joi.ValidationResult => {
  const schema = joi.object({
    studentId: joi.string().messages({
      "string.empty": "معرف الطالب مطلوب",
    }),
    total: joi.number().min(0).messages({
      "number.min": "المجموع الكلي لا يمكن أن يكون سالباً",
    }),
    questionNum: joi.number().min(1).messages({
      "number.min": "يجب أن يكون هناك سؤال واحد على الأقل",
    }),
    numOfWrong: joi.number().min(0).messages({
      "number.min": "عدد الإجابات الخاطئة لا يمكن أن يكون سالباً",
    }),
    numOfRight: joi.number().min(0).messages({
      "number.min": "عدد الإجابات الصحيحة لا يمكن أن يكون سالباً",
    }),
    time: joi
      .string()
      .pattern(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$|^[0-5]?[0-9]:[0-5][0-9]$/
      )
      .messages({
        "string.pattern.base":
          "يجب أن يكون الوقت بصيغة صحيحة (مثال: 05:30 أو 01:25:45)",
      }),
  });

  return schema.validate(obj);
};

export { Result, validateCreateResult, validateUpdateResult };

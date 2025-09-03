import mongoose, { Schema, Model, Types } from "mongoose";
import joi from "joi";
import { IQuestion } from "./dtos";

// Question Schema
const QuestionSchema = new Schema<IQuestion>(
  {
    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: [true, "معرف الامتحان مطلوب"],
    },
    text: {
      type: String,
      required: [true, "نص السؤال مطلوب"],
      trim: true,
      maxlength: [1000, "نص السؤال يجب ألا يتجاوز 1000 حرف"],
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

QuestionSchema.virtual("requests", {
  ref: "Request",
  localField: "_id",
  foreignField: "questionId",
});

// Question Model
const Question: Model<IQuestion> = mongoose.model<IQuestion>(
  "Question",
  QuestionSchema
);

// Indexes
QuestionSchema.index({ createdAt: -1 });

// Validation: Create Question
const validateCreateQuestion = (obj: IQuestion): joi.ValidationResult => {
  const schema = joi.object({
    examId: joi.string().required().messages({
      "string.empty": "معرف الامتحان مطلوب",
      "any.required": "معرف الامتحان مطلوب",
    }),
    text: joi.string().max(1000).required().messages({
      "string.empty": "نص السؤال مطلوب",
      "string.max": "نص السؤال يجب ألا يتجاوز 1000 حرف",
      "any.required": "نص السؤال مطلوب",
    }),
    image: joi.string().uri().allow("").messages({
      "string.uri": "يجب أن يكون رابط الصورة صحيحًا",
    }),
  });

  return schema.validate(obj);
};

// Validation: Update Question
const validateUpdateQuestion = (
  obj: Partial<IQuestion>
): joi.ValidationResult => {
  const schema = joi.object({
    examId: joi.string().messages({
      "string.empty": "معرف الامتحان مطلوب",
    }),
    text: joi.string().max(1000).messages({
      "string.empty": "نص السؤال مطلوب",
      "string.max": "نص السؤال يجب ألا يتجاوز 1000 حرف",
    }),
    image: joi.string().uri().allow("").messages({
      "string.uri": "يجب أن يكون رابط الصورة صحيحًا",
    }),
  });

  return schema.validate(obj);
};

export { Question, validateCreateQuestion, validateUpdateQuestion };

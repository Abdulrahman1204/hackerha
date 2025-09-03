import mongoose, { Schema, Model } from "mongoose";
import joi from "joi";
import { IQuestionBank } from "./dtos";


// Question Bacnk Schema
const QuestionBacnkSchema = new Schema<IQuestionBank>(
  {
    contentId: {
      type: Schema.Types.ObjectId,
      ref: "Content",
      required: [true, "معرف المحتوى مطلوب"],
    },
    text: {
      type: String,
      required: [true, "نص السؤال مطلوب"],
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

QuestionBacnkSchema.virtual("requests", {
  ref: "Request",
  localField: "_id",
  foreignField: "questionId",
});

// Question Model
const QuestionBank: Model<IQuestionBank> = mongoose.model<IQuestionBank>(
  "QuestionBank",
  QuestionBacnkSchema
);

// Indexes
QuestionBacnkSchema.index({ createdAt: -1 });

// Validation: Create Question Bank
const validateCreateQuestionBank = (obj: IQuestionBank): joi.ValidationResult => {
  const schema = joi.object({
    contentId: joi.string().required().messages({
      "string.empty": "معرف المحتوى مطلوب",
      "any.required": "معرف المحتوى مطلوب",
    }),
    text: joi.string().required().messages({
      "string.empty": "نص السؤال مطلوب",
      "any.required": "نص السؤال مطلوب",
    }),
    image: joi.string().uri().messages({
      "string.uri": "يجب أن يكون رابط الصورة صحيحًا",
    }),
  });

  return schema.validate(obj);
};

// Validation: Update Question Bank
const validateUpdateQuestionBank = (
  obj: Partial<IQuestionBank>
): joi.ValidationResult => {
  const schema = joi.object({
    contentId: joi.string().messages({
      "string.empty": "معرف المحتوى مطلوب",
      "any.required": "معرف المحتوى مطلوب",
    }),
    text: joi.string().messages({
      "string.empty": "نص السؤال مطلوب",
    }),
    image: joi.string().uri().messages({
      "string.uri": "يجب أن يكون رابط الصورة صحيحًا",
    }),
  });

  return schema.validate(obj);
};

export { QuestionBank, validateCreateQuestionBank, validateUpdateQuestionBank };


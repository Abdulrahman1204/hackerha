import mongoose, { Schema, Model, Types } from "mongoose";
import joi from "joi";
import { IRequestBank, IAnswerBank } from "./dtos";

// AnswerBank Schema
const answerBankSchema = new Schema<IAnswerBank>(
  {
    title: {
      type: String,
      required: [true, "نص الإجابة مطلوب"],
      trim: true,
      maxlength: [500, "نص الإجابة يجب ألا يتجاوز 500 حرف"],
    },
    correct: {
      type: Boolean,
      required: [true, "حالة الإجابة (صح/خطأ) مطلوبة"],
      default: false,
    },
  },
  { _id: true }
);

// RequestBank Schema
const RequestBankSchema = new Schema<IRequestBank>(
  {
    questionBankId: {
      type: Schema.Types.ObjectId,
      ref: "QuestionBank",
      required: [true, "معرف بنك الأسئلة مطلوب"],
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
    answers: {
      type: [answerBankSchema],
      required: [true, "الإجابات مطلوبة"],
      validate: {
        validator: (answers: IAnswerBank[]) =>
          answers.length >= 2 && answers.some((a) => a.correct),
        message:
          "يجب أن تحتوي على إجابتين على الأقل مع إجابة صحيحة واحدة على الأقل",
      },
    },
  },
  { timestamps: true }
);

// RequestBank Model
const RequestBank: Model<IRequestBank> = mongoose.model<IRequestBank>(
  "RequestBank",
  RequestBankSchema
);

// Indexes
RequestBankSchema.index({ createdAt: -1 });

// Validation: AnswerBank
const validateAnswerBank = (obj: IAnswerBank): joi.ValidationResult => {
  const schema = joi.object({
    title: joi.string().max(500).required().messages({
      "string.empty": "نص الإجابة مطلوب",
      "string.max": "نص الإجابة يجب ألا يتجاوز 500 حرف",
      "any.required": "نص الإجابة مطلوب",
    }),
    correct: joi.boolean().required().messages({
      "boolean.base": "يجب أن تكون حالة الإجابة صح أو خطأ",
      "any.required": "حالة الإجابة مطلوبة",
    }),
  });

  return schema.validate(obj);
};

// Validation: Create RequestBank
const validateCreateRequestBank = (obj: IRequestBank): joi.ValidationResult => {
  const schema = joi.object({
    questionBankId: joi.string().required().messages({
      "string.empty": "معرف بنك الأسئلة مطلوب",
      "any.required": "معرف بنك الأسئلة مطلوب",
    }),
    text: joi.string().max(1000).required().messages({
      "string.empty": "نص السؤال مطلوب",
      "string.max": "نص السؤال يجب ألا يتجاوز 1000 حرف",
      "any.required": "نص السؤال مطلوب",
    }),
    image: joi.string().uri().allow("").messages({
      "string.uri": "يجب أن يكون رابط الصورة صحيحًا",
    }),
    answers: joi
      .array()
      .items(
        joi.object().custom((value, helpers) => {
          const result = validateAnswerBank(value);
          if (result.error) {
            return helpers.error("any.invalid");
          }
          return value;
        })
      )
      .min(2)
      .required()
      .messages({
        "array.base": "يجب أن تكون الإجابات مصفوفة",
        "array.min": "يجب أن تحتوي على إجابتين على الأقل",
        "any.required": "الإجابات مطلوبة",
        "any.invalid": "إجابة غير صالحة",
      })
      .custom((answers: any[], helpers) => {
        if (!answers.some((a: any) => a.correct)) {
          return helpers.error("any.custom");
        }
        return answers;
      })
      .messages({
        "any.custom": "يجب أن تحتوي على إجابة صحيحة واحدة على الأقل",
      }),
  });

  return schema.validate(obj);
};

// Validation: Update RequestBank
const validateUpdateRequestBank = (
  obj: Partial<IRequestBank>
): joi.ValidationResult => {
  const schema = joi.object({
    questionBankId: joi.string().messages({
      "string.empty": "معرف بنك الأسئلة مطلوب",
    }),
    text: joi.string().max(1000).messages({
      "string.empty": "نص السؤال مطلوب",
      "string.max": "نص السؤال يجب ألا يتجاوز 1000 حرف",
    }),
    image: joi.string().uri().allow("").messages({
      "string.uri": "يجب أن يكون رابط الصورة صحيحًا",
    }),
    answers: joi
      .array()
      .items(
        joi.object({
          title: joi.string().max(500).messages({
            "string.empty": "نص الإجابة مطلوب",
            "string.max": "نص الإجابة يجب ألا يتجاوز 500 حرف",
          }),
          correct: joi.boolean().messages({
            "boolean.base": "يجب أن تكون حالة الإجابة صح أو خطأ",
          }),
        })
      )
      .messages({
        "array.base": "يجب أن تكون الإجابات مصفوفة",
      }),
  });

  return schema.validate(obj);
};

export {
  RequestBank,
  validateCreateRequestBank,
  validateUpdateRequestBank,
  validateAnswerBank,
};
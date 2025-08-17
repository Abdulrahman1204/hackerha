import mongoose, { Schema, Model } from "mongoose";
import joi from "joi";
import { IQuestionBank } from "./dtos";

// Answer Schema
const answerSchema = new Schema({
  title: {
    type: String,
    required: [true, "نص الإجابة مطلوب"],
    trim: true,
  },
  correct: {
    type: Boolean,
    required: [true, "حالة الإجابة (صح/خطأ) مطلوبة"],
    default: false,
  },
});

// Request Schema
const requestSchema = new Schema({
  text: {
    type: String,
    required: [true, "نص السؤال الفرعي مطلوب"],
    trim: true,
  },
  answers: {
    type: [answerSchema],
    required: [true, "الإجابات مطلوبة"],
    validate: {
      validator: (answers: any[]) =>
        answers.length >= 2 && answers.some((a) => a.correct),
      message:
        "يجب أن تحتوي على إجابتين على الأقل مع إجابة صحيحة واحدة على الأقل",
    },
  },
});

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
    requests: {
      type: [requestSchema],
      required: [true, "الأسئلة الفرعية مطلوبة"],
      validate: {
        validator: (requests: any[]) => requests.length > 0,
        message: "يجب أن يحتوي على سؤال فرعي واحد على الأقل",
      },
    },
  },
  { timestamps: true }
);

// Question Model
const QuestionBank: Model<IQuestionBank> = mongoose.model<IQuestionBank>(
  "QuestionBank",
  QuestionBacnkSchema
);

// Indexes
QuestionBacnkSchema.index({ contentId: 1 });
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
    requests: joi
      .array()
      .items(
        joi.object({
          text: joi.string().required().messages({
            "string.empty": "نص السؤال الفرعي مطلوب",
            "any.required": "نص السؤال الفرعي مطلوب",
          }),
          answers: joi
            .array()
            .items(
              joi
                .object({
                  title: joi.string().required().messages({
                    "string.empty": "نص الإجابة مطلوب",
                    "any.required": "نص الإجابة مطلوب",
                  }),
                  correct: joi.boolean().required().messages({
                    "boolean.base": "يجب أن تكون حالة الإجابة صح أو خطأ",
                    "any.required": "حالة الإجابة مطلوبة",
                  }),
                })
                .min(2)
                .messages({
                  "array.min": "يجب أن يحتوي على إجابتين على الأقل",
                })
            )
            .custom((answers, helpers) => {
              if (!answers.some((a: any) => a.correct)) {
                return helpers.error("any.invalid");
              }
              return answers;
            })
            .messages({
              "any.invalid": "يجب أن تحتوي على إجابة صحيحة واحدة على الأقل",
            }),
        })
      )
      .min(1)
      .messages({
        "array.min": "يجب أن يحتوي على سؤال فرعي واحد على الأقل",
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
    requests: joi
      .array()
      .items(
        joi.object({
          text: joi.string().messages({
            "string.empty": "نص السؤال الفرعي مطلوب",
          }),
          answers: joi
            .array()
            .items(
              joi
                .object({
                  title: joi.string().messages({
                    "string.empty": "نص الإجابة مطلوب",
                  }),
                  correct: joi.boolean().messages({
                    "boolean.base": "يجب أن تكون حالة الإجابة صح أو خطأ",
                  }),
                })
                .min(2)
                .messages({
                  "array.min": "يجب أن يحتوي على إجابتين على الأقل",
                })
            )
            .custom((answers, helpers) => {
              if (answers && !answers.some((a: any) => a.correct)) {
                return helpers.error("any.invalid");
              }
              return answers;
            })
            .messages({
              "any.invalid": "يجب أن تحتوي على إجابة صحيحة واحدة على الأقل",
            }),
        })
      )
      .min(1)
      .messages({
        "array.min": "يجب أن يحتوي على سؤال فرعي واحد على الأقل",
      }),
  });

  return schema.validate(obj);
};

export { QuestionBank, validateCreateQuestionBank, validateUpdateQuestionBank };

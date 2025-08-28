import mongoose, { Schema, Model, Types } from "mongoose";
import joi from "joi";
import { IQuestion, IRequest, IAnswer } from "./dtos";

// Answer Schema
const answerSchema = new Schema<IAnswer>(
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

// Request Schema
const requestSchema = new Schema<IRequest>(
  {
    text: {
      type: String,
      required: [true, "نص السؤال الفرعي مطلوب"],
      trim: true,
      maxlength: [1000, "نص السؤال الفرعي يجب ألا يتجاوز 1000 حرف"],
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    answers: {
      type: [answerSchema],
      required: [true, "الإجابات مطلوبة"],
      validate: {
        validator: (answers: IAnswer[]) =>
          answers.length >= 2 && answers.some((a) => a.correct),
        message:
          "يجب أن تحتوي على إجابتين على الأقل مع إجابة صحيحة واحدة على الأقل",
      },
    },
  },
  { _id: true }
);

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
    requests: {
      type: [requestSchema],
      required: [true, "الأسئلة الفرعية مطلوبة"],
      validate: {
        validator: (requests: IRequest[]) => requests.length > 0,
        message: "يجب أن يحتوي على سؤال فرعي واحد على الأقل",
      },
    },
  },
  { timestamps: true }
);

// Question Model
const Question: Model<IQuestion> = mongoose.model<IQuestion>(
  "Question",
  QuestionSchema
);

// Indexes
QuestionSchema.index({ examId: 1 });
QuestionSchema.index({ createdAt: -1 });

// Validation: Answer
const validateAnswer = (obj: IAnswer): joi.ValidationResult => {
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

// Validation: Request
const validateRequest = (obj: IRequest): joi.ValidationResult => {
  const schema = joi.object({
    text: joi.string().max(1000).required().messages({
      "string.empty": "نص السؤال الفرعي مطلوب",
      "string.max": "نص السؤال الفرعي يجب ألا يتجاوز 1000 حرف",
      "any.required": "نص السؤال الفرعي مطلوب",
    }),
    image: joi.string().uri().allow("").messages({
      "string.uri": "يجب أن يكون رابط الصورة صحيحًا",
    }),
    answers: joi
      .array()
      .items(
        joi.object().custom((value, helpers) => {
          const result = validateAnswer(value);
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
    requests: joi
      .array()
      .items(
        joi.object().custom((value, helpers) => {
          const result = validateRequest(value);
          if (result.error) {
            return helpers.error("any.invalid");
          }
          return value;
        })
      )
      .min(1)
      .required()
      .messages({
        "array.base": "يجب أن تكون الأسئلة الفرعية مصفوفة",
        "array.min": "يجب أن يحتوي على سؤال فرعي واحد على الأقل",
        "any.required": "الأسئلة الفرعية مطلوبة",
        "any.invalid": "سؤال فرعي غير صالح",
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
    requests: joi
      .array()
      .items(
        joi.object({
          text: joi.string().max(1000).messages({
            "string.empty": "نص السؤال الفرعي مطلوب",
            "string.max": "نص السؤال الفرعي يجب ألا يتجاوز 1000 حرف",
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
        })
      )
      .messages({
        "array.base": "يجب أن تكون الأسئلة الفرعية مصفوفة",
      }),
  });

  return schema.validate(obj);
};

export {
  Question,
  validateCreateQuestion,
  validateUpdateQuestion,
  validateRequest,
  validateAnswer,
};
 
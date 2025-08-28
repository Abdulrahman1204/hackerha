import mongoose, { Schema, Model } from "mongoose";
import joi from "joi";
import { Document } from "mongoose";
import { IBanks } from "./dtos";

// Bank Schema
const BankSchema = new Schema<IBanks>(
  {
    image: {
      type: String,
      required: [true, "صورة البنك مطلوبة"],
    },
    title: {
      type: String,
      required: [true, "عنوان البنك مطلوب"],
      trim: true,
      maxlength: [100, "العنوان يجب ألا يتجاوز 100 حرف"],
    },
    year: {
      type: String,
      enum: {
        values: [
          "السنة الأولى",
          "السنة الثانية",
          "السنة الثالثة",
          "السنة الرابعة",
          "السنة الخامسة",
        ],
        message: "يجب ان يكون من السنة الاولى الى السنة الخامسة",
      },
      required: [true, "السنة الدراسية مطلوبة"],
    },
    semester: {
      type: String,
      enum: {
        values: ["الفصل الأول", "الفصل الثاني"],
        message: "يجب ان يكون فالفصل الأول او الفصل الثاني",
      },
      required: [true, "الفصل الدراسي مطلوب"],
    },
    free: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Bank Model
const Bank: Model<IBanks> = mongoose.model<IBanks>("Bank", BankSchema);

// Validation Create Bank
const validateCreateBank = (obj: IBanks): joi.ValidationResult => {
  const schema = joi.object({
    image: joi.string().messages({
      "string.empty": "صورة البنك مطلوبة",
      "any.required": "صورة البنك مطلوبة",
    }),
    title: joi.string().max(100).required().messages({
      "string.empty": "عنوان البنك مطلوب",
      "string.max": "العنوان يجب ألا يتجاوز 100 حرف",
      "any.required": "عنوان البنك مطلوب",
    }),
    year: joi
      .string()
      .valid(
        "السنة الأولى",
        "السنة الثانية",
        "السنة الثالثة",
        "السنة الرابعة",
        "السنة الخامسة"
      )
      .required()
      .messages({
        "any.only": "يجب ان يكون من السنة الاولى الى السنة الخامسة",
        "any.required": "السنة الدراسية مطلوبة",
      }),
    semester: joi
      .string()
      .valid("الفصل الأول", "الفصل الثاني")
      .required()
      .messages({
        "any.only": "يجب ان يكون الفصل الأول او الفصل الثاني",
        "any.required": "الفصل الدراسي مطلوب",
      }),
    free: joi.boolean().default(true),
  });

  return schema.validate(obj);
};

// Validation Update Bank
const validateUpdateBank = (obj: Partial<IBanks>): joi.ValidationResult => {
  const schema = joi.object({
    image: joi.string().messages({
      "string.empty": "صورة البنك مطلوبة",
    }),
    title: joi.string().max(100).messages({
      "string.empty": "عنوان البنك مطلوب",
      "string.max": "العنوان يجب ألا يتجاوز 100 حرف",
    }),
    year: joi
      .string()
      .valid(
        "السنة الأولى",
        "السنة الثانية",
        "السنة الثالثة",
        "السنة الرابعة",
        "السنة الخامسة"
      )
      .messages({
        "any.only": "يجب ان يكون من السنة الاولى الى السنة الخامسة",
      }),
    semester: joi.string().valid("الفصل الأول", "الفصل الثاني").messages({
      "any.only": "يجب ان يكون الفصل الأول او الفصل الثاني",
    }),
    free: joi.boolean(),
  });

  return schema.validate(obj);
};

export { Bank, validateCreateBank, validateUpdateBank };

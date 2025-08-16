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
      type: Number,
      required: [true, "السنة الدراسية مطلوبة"],
      min: [1, "السنة الدراسية يجب أن تكون على الأقل 1"],
      max: [5, "السنة الدراسية يجب ألا تتجاوز 5"],
    },
    semester: {
      type: Number,
      required: [true, "الفصل الدراسي مطلوب"],
      min: [1, "الفصل الدراسي يجب أن يكون على الأقل 1"],
      max: [2, "الفصل الدراسي يجب ألا يتجاوز 2"],
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
    year: joi.number().min(1).max(5).required().messages({
      "number.base": "السنة الدراسية يجب أن تكون رقماً",
      "number.min": "السنة الدراسية يجب أن تكون على الأقل 1",
      "number.max": "السنة الدراسية يجب ألا تتجاوز 5",
      "any.required": "السنة الدراسية مطلوبة",
    }),
    semester: joi.number().min(1).max(2).required().messages({
      "number.base": "الفصل الدراسي يجب أن يكون رقماً",
      "number.min": "الفصل الدراسي يجب أن يكون على الأقل 1",
      "number.max": "الفصل الدراسي يجب ألا يتجاوز 2",
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
    year: joi.number().min(1).max(5).messages({
      "number.base": "السنة الدراسية يجب أن تكون رقماً",
      "number.min": "السنة الدراسية يجب أن تكون على الأقل 1",
      "number.max": "السنة الدراسية يجب ألا تتجاوز 5",
    }),
    semester: joi.number().min(1).max(2).messages({
      "number.base": "الفصل الدراسي يجب أن يكون رقماً",
      "number.min": "الفصل الدراسي يجب أن يكون على الأقل 1",
      "number.max": "الفصل الدراسي يجب ألا يتجاوز 2",
    }),
    free: joi.boolean(),
  });

  return schema.validate(obj);
};

export { Bank, validateCreateBank, validateUpdateBank };
import mongoose, { Schema, Model } from "mongoose";
import joi from "joi";
import { IContent } from "./dtos";

// Content Schema
const ContentSchema = new Schema<IContent>(
  {
    bank: {
      type: Schema.Types.ObjectId,
      ref: "Bank",
      required: [true, "البنك مطلوب"],
    },
    title: {
      type: String,
      required: [true, "العنوان مطلوب"],
      trim: true,
      maxlength: [100, "العنوان يجب ألا يتجاوز 100 حرف"],
    },
    duration: {
      type: String,
      required: [true, "المدة بالدقائق مطلوبة"],
    },
  },
  {
    timestamps: true,
  }
);

// Content Model
const Content: Model<IContent> = mongoose.model<IContent>(
  "Content",
  ContentSchema
);

// Validation Create Content
const validateCreateContent = (obj: IContent): joi.ValidationResult => {
  const schema = joi.object({
    bank: joi.string().required().messages({
      "string.empty": "البنك مطلوب",
      "any.required": "البنك مطلوب",
    }),
    title: joi.string().max(100).required().messages({
      "string.empty": "العنوان مطلوب",
      "string.max": "العنوان يجب ألا يتجاوز 100 حرف",
      "any.required": "العنوان مطلوب",
    }),
    duration: joi.string().min(1).required().messages({
      "string.base": "المدة يجب أن تكون رقماً",
      "any.required": "المدة بالدقائق مطلوبة",
    }),
  });

  return schema.validate(obj);
};

// Validation Update Content
const validateUpdateContent = (
  obj: Partial<IContent>
): joi.ValidationResult => {
  const schema = joi.object({
    bank: joi.string().messages({
      "string.empty": "البنك مطلوب",
      "any.required": "البنك مطلوب",
    }),
    title: joi.string().max(100).messages({
      "string.empty": "العنوان مطلوب",
      "string.max": "العنوان يجب ألا يتجاوز 100 حرف",
      "any.required": "العنوان مطلوب",
    }),
    duration: joi.string().min(1).messages({
      "string.base": "المدة يجب أن تكون رقماً",
      "any.required": "المدة بالدقائق مطلوبة",
    }),
  });

  return schema.validate(obj);
};

export { Content, validateCreateContent, validateUpdateContent };

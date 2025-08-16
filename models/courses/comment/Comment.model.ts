import mongoose, { Schema, Model } from "mongoose";
import joi from "joi";
import { IComment } from "./dtos";

const CommentSchema = new Schema<IComment>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "معرف الكورس مطلوب"]
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "معرف الطالب مطلوب"]
    },
    text: {
      type: String,
      required: [true, "نص التعليق مطلوب"],
      trim: true,
      maxlength: [500, "التعليق يجب ألا يتجاوز 500 حرف"]
    },
    rating: {
      type: Number,
      required: [true, "التقييم مطلوب"],
      min: [1, "التقييم يجب أن يكون بين 1 و 5"],
      max: [5, "التقييم يجب أن يكون بين 1 و 5"]
    }
  },
  { timestamps: true }
);

// Indexes
CommentSchema.index({ courseId: 1 });
CommentSchema.index({ studentId: 1 });
CommentSchema.index({ createdAt: -1 });

const Comment: Model<IComment> = mongoose.model<IComment>("Comment", CommentSchema);

// Validation
const validateCreateComment = (obj: IComment): joi.ValidationResult => {
  const schema = joi.object({
    courseId: joi.string().required().messages({
      "string.empty": "معرف الكورس مطلوب",
      "any.required": "معرف الكورس مطلوب"
    }),
    studentId: joi.string().required().messages({
      "string.empty": "معرف الطالب مطلوب",
      "any.required": "معرف الطالب مطلوب"
    }),
    text: joi.string().max(500).required().messages({
      "string.empty": "نص التعليق مطلوب",
      "string.max": "التعليق يجب ألا يتجاوز 500 حرف",
      "any.required": "نص التعليق مطلوب"
    }),
    rating: joi.number().min(1).max(5).required().messages({
      "number.base": "التقييم يجب أن يكون رقماً",
      "number.min": "التقييم يجب أن يكون بين 1 و 5",
      "number.max": "التقييم يجب أن يكون بين 1 و 5",
      "any.required": "التقييم مطلوب"
    })
  });
  return schema.validate(obj);
};

const validateUpdateComment = (obj: Partial<IComment>): joi.ValidationResult => {
  const schema = joi.object({
    text: joi.string().max(500).messages({
      "string.empty": "نص التعليق مطلوب",
      "string.max": "التعليق يجب ألا يتجاوز 500 حرف"
    }),
    rating: joi.number().min(1).max(5).messages({
      "number.base": "التقييم يجب أن يكون رقماً",
      "number.min": "التقييم يجب أن يكون بين 1 و 5",
      "number.max": "التقييم يجب أن يكون بين 1 و 5"
    })
  });
  return schema.validate(obj);
};

export { Comment, validateCreateComment, validateUpdateComment };
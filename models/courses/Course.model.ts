import mongoose, { Schema, Model } from "mongoose";
import joi from "joi";
import { ICourse } from "./dtos";

// Course Schema
const CourseSchema = new Schema<ICourse>(
  {
    image: {
      type: String,
      required: [true, "صورة الكورس مطلوبة"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "اسم الكورس مطلوب"],
      trim: true,
      maxlength: [100, "الاسم يجب ألا يتجاوز 100 حرف"],
    },
    description: {
      type: String,
      required: [true, "وصف الكورس مطلوب"],
      trim: true,
      maxlength: [500, "الوصف يجب ألا يتجاوز 500 حرف"],
    },
    price: {
      type: Number,
      required: [true, "سعر الكورس مطلوب"],
      min: [0, "السعر لا يمكن أن يكون سالبًا"],
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
        message: "يجب ان يكون فالفصلصل الأول او الفصل الثاني",
      },
      required: [true, "الفصل الدراسي مطلوب"],
    },
    note: {
      type: String,
      trim: true,
      maxlength: [200, "الملاحظات يجب ألا تتجاوز 200 حرف"],
    },
    type: {
      type: String,
      enum: {
        values: ["نظري", "عملي", "شاملة"],
        message: "يجب ان يكون نظري او عملي أو شامل",
      },
      required: [true, "نوع الكورس مطلوب"],
    },
    discount: {
      dis: {
        type: Boolean,
        required: [true, "يجب أن تحدد اذا هناك تخفيض ام لا"],
      },
      rate: {
        type: Number,
        min: [0, "نسبة التخفيض لا يمكن أن تكون أقل من 0"],
        max: [100, "نسبة التخفيض لا يمكن أن تتجاوز 100"],
      },
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "التقييم لا يمكن أن يكون أقل من 0"],
      max: [5, "التقييم لا يمكن أن يتجاوز 5"],
    },
    about: {
      type: String,
      required: [true, "معلومات عن الكورس مطلوبة"],
      trim: true,
      maxlength: [1000, "المعلومات يجب ألا تتجاوز 1000 حرف"],
    },
    video: {
      type: String,
      trim: true,
    },
    free: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Course Model
const Course: Model<ICourse> = mongoose.model<ICourse>("Course", CourseSchema);

// Course Indexes
CourseSchema.index({ createdAt: -1 });

// Validation: Create Course
const validateCreateCourse = (obj: ICourse): joi.ValidationResult => {
  const schema = joi.object({
    name: joi.string().max(100).required().messages({
      "string.empty": "اسم الكورس مطلوب",
      "string.max": "الاسم يجب ألا يتجاوز 100 حرف",
      "any.required": "اسم الكورس مطلوب",
    }),
    description: joi.string().max(500).required().messages({
      "string.empty": "وصف الكورس مطلوب",
      "string.max": "الوصف يجب ألا يتجاوز 500 حرف",
      "any.required": "وصف الكورس مطلوب",
    }),
    price: joi.number().min(0).required().messages({
      "number.min": "السعر لا يمكن أن يكون سالبًا",
      "any.required": "سعر الكورس مطلوب",
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
      .valid("فصل الأول", "فصل الثاني")
      .required()
      .messages({
        "any.only": "يجب ان يكون فصل الأول او فصل الثاني",
        "any.required": "الفصل الدراسي مطلوب",
      }),
    note: joi.string().max(200).messages({
      "string.max": "الملاحظات يجب ألا تتجاوز 200 حرف",
    }),
    type: joi.string().valid("نظري", "عملي", "شاملة").required().messages({
      "any.only": "يجب ان يكون نظري او عملي أو شاملة",
      "any.required": "نوع الكورس مطلوب",
    }),
    discount: joi
      .object({
        dis: joi.boolean().required().messages({
          "boolean.base": "يجب أن تكون قيمة dis صحيحة أو خاطئة",
          "any.required": "يجب تحديد وجود تخفيض أم لا",
        }),
        rate: joi
          .number()
          .min(0)
          .max(100)
          .when("dis", {
            is: true,
            then: joi.required().messages({
              "any.required": "نسبة التخفيض مطلوبة عندما يكون هناك تخفيض",
              "number.min": "نسبة التخفيض لا يمكن أن تكون أقل من 0",
              "number.max": "نسبة التخفيض لا يمكن أن تتجاوز 100",
            }),
            otherwise: joi.optional(),
          }),
      })
      .required()
      .messages({
        "object.base": "يجب أن يكون التخفيض كائنًا",
        "any.required": "معلومات التخفيض مطلوبة",
      }),
    about: joi.string().max(1000).required().messages({
      "string.empty": "معلومات عن الكورس مطلوبة",
      "string.max": "المعلومات يجب ألا تتجاوز 1000 حرف",
      "any.required": "معلومات عن الكورس مطلوبة",
    }),
    video: joi.string().messages({
      "string.empty": "رابط الفيديو مطلوب",
    }),
    free: joi.boolean().default(false).messages({
      "boolean.base": "يجب أن تكون قيمة free صحيحة أو خاطئة",
    }),
  });

  return schema.validate(obj);
};

// Validation: Update Course
const validateUpdateCourse = (obj: Partial<ICourse>): joi.ValidationResult => {
  const schema = joi.object({
    name: joi.string().max(100).messages({
      "string.empty": "اسم الكورس مطلوب",
      "string.max": "الاسم يجب ألا يتجاوز 100 حرف",
    }),
    description: joi.string().max(500).messages({
      "string.empty": "وصف الكورس مطلوب",
      "string.max": "الوصف يجب ألا يتجاوز 500 حرف",
    }),
    price: joi.number().min(0).messages({
      "number.min": "السعر لا يمكن أن يكون سالبًا",
    }),
    note: joi.string().max(200).messages({
      "string.max": "الملاحظات يجب ألا تتجاوز 200 حرف",
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
    semester: joi.string().valid("فصل الأول", "فصل الثاني").messages({
      "any.only": "يجب ان يكون فصل الأول او فصل الثاني",
    }),
    type: joi.string().valid("نظري", "عملي", "شاملة").messages({
      "any.only": "يجب ان يكون نظري او عملي أو شاملة",
    }),
    discount: joi
      .object({
        dis: joi.boolean().messages({
          "boolean.base": "يجب أن تكون قيمة dis صحيحة أو خاطئة",
        }),
        rate: joi
          .number()
          .min(0)
          .max(100)
          .when("dis", {
            is: true,
            then: joi.required().messages({
              "any.required": "نسبة التخفيض مطلوبة عندما يكون هناك تخفيض",
              "number.min": "نسبة التخفيض لا يمكن أن تكون أقل من 0",
              "number.max": "نسبة التخفيض لا يمكن أن تتجاوز 100",
            }),
            otherwise: joi.optional(),
          }),
      })
      .messages({
        "object.base": "يجب أن يكون التخفيض كائنًا",
      }),
    about: joi.string().max(1000).messages({
      "string.empty": "معلومات عن الكورس مطلوبة",
      "string.max": "المعلومات يجب ألا تتجاوز 1000 حرف",
    }),
    video: joi.string().messages({
      "string.empty": "رابط الفيديو مطلوب",
    }),
    free: joi.boolean().messages({
      "boolean.base": "يجب أن تكون قيمة free صحيحة أو خاطئة",
    }),
  });

  return schema.validate(obj);
};

export { Course, validateCreateCourse, validateUpdateCourse };

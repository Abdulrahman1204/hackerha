import mongoose, { Schema, Model } from "mongoose";
import joi from "joi";
import { IOtp, IStudent } from "./dtos";
import bcrypt from "bcrypt";

// Student Schema
const StudentSchema = new Schema<IStudent>(
  {
    profilePhoto: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      required: true,
    },
    userName: {
      type: String,
      required: [true, "الاسم الكامل مطلوب"],
      trim: true,
      maxlength: [100, "الاسم الكامل يجب ألا يتجاوز 100 حرف"],
    },
    phoneNumber: {
      type: String,
      required: [true, "رقم الهاتف مطلوب"],
      trim: true,
      validate: {
        validator: (v) => /^09[0-9]{8}$/.test(v),
        message: (props) =>
          `${props.value} ليس رقم هاتف صالح! يجب أن يبدأ بـ 09 ويتكون من 10 أرقام.`,
      },
    },
    academicYear: {
      type: Date,
      required: [true, "السنة الدراسية مطلوبة"],
    },
    universityNumber: {
      type: Number,
      required: [true, "الرقم الجامعي مطلوب"],
      trim: true,
    },
    gender: {
      type: String,
      enum: {
        values: ["ذكر", "انثى"],
        message: "يحب أن يكون ذكر أو انثى",
      },
      required: [true, "نوع الجنس مطلوب"],
    },
    birth: {
      type: Date,
      required: [true, "تاريخ الميلاد مطلوب"],
    },
    email: {
      type: String,
      required: [true, "البريد الإلكتروني مطلوب"],
      trim: true,
      minlength: [3, "البريد الإلكتروني يجب أن يكون على الأقل حرفين"],
      maxlength: [100, "البريد الإلكتروني يجب ألا يتجاوز 100 حرف"],
    },
    password: {
      type: String,
      required: [true, "كلمة السر مطلوبة"],
      trim: true,
      minlength: [8, "كلمة السر يجب أن يكون على الأقل 8 أحرف"],
    },
    otp: { type: String, length: 5 },
    available: {
      type: Boolean,
      default: false,
    },
    suspended: {
      type: Boolean,
      default: false,
    },
    resetPass: {
      type: Boolean,
      default: false,
    },
    suspensionReason: String,
    favoriteCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
        default: [],
      },
    ],
    favoriteSessions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Session",
        default: [],
      },
    ],
    favoriteBank: [
      {
        type: Schema.Types.ObjectId,
        ref: "Bank",
        default: [],
      },
    ],
    enrolledCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
        default: [],
      },
    ],
    banks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Bank",
        default: [],
      },
    ],
    contents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Content",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Password encryption
StudentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

// Student Model
const Student: Model<IStudent> = mongoose.model<IStudent>(
  "Student",
  StudentSchema
);

// Student Indexes
StudentSchema.index({ createdAt: -1 });

// Validation Check Otp
const validationOtp = (obj: IOtp): joi.ValidationResult => {
  const schema = joi.object({
    otp: joi.string().length(5).required().messages({
      "string.empty": "لا يمكن أن يكون فارغاً",
      "any.required": "مطلوب",
    }),
  });
  return schema.validate(obj);
};

// Validation Create Student
const validateCreateStudent = (obj: IStudent): joi.ValidationResult => {
  const schema = joi.object({
    userName: joi.string().max(100).required().messages({
      "string.empty": "الاسم الكامل مطلوب",
      "string.max": "الاسم الكامل يجب ألا يتجاوز 100 حرف",
      "any.required": "الاسم الكامل مطلوب",
    }),
    phoneNumber: joi
      .string()
      .pattern(/^09[0-9]{8}$/)
      .required()
      .messages({
        "string.pattern.base":
          "رقم الهاتف غير صالح! يجب أن يبدأ بـ 09 ويتكون من 10 أرقام.",
        "string.empty": "رقم الهاتف مطلوب",
        "any.required": "رقم الهاتف مطلوب",
      }),
    gender: joi.string().valid("ذكر", "انثى").required().messages({
      "any.only": "يحب أن يكون ذكر أو انثى",
      "any.required": "نوع الجنس مطلوب",
    }),
    academicYear: joi.date().required().messages({
      "date.base": "صيغة السنة الدراسية غير صحيحة",
      "any.required": "السنة الدراسية مطلوبة",
    }),
    universityNumber: joi.number().required().messages({
      "string.empty": "الرقم الجامعي مطلوب",
      "any.required": "الرقم الجامعي مطلوب",
    }),
    birth: joi.date().required().messages({
      "date.base": "تاريخ الميلاد غير صالح",
      "any.required": "تاريخ الميلاد مطلوب",
    }),
    email: joi.string().email().min(3).max(100).required().messages({
      "string.email": "البريد الإلكتروني غير صالح",
      "string.empty": "البريد الإلكتروني مطلوب",
      "string.min": "البريد الإلكتروني يجب أن يكون على الأقل 3 أحرف",
      "string.max": "البريد الإلكتروني يجب ألا يتجاوز 100 حرف",
      "any.required": "البريد الإلكتروني مطلوب",
    }),
    password: joi.string().min(8).required().messages({
      "string.min": "كلمة السر يجب أن تكون على الأقل 8 أحرف",
      "string.empty": "كلمة السر مطلوبة",
      "any.required": "كلمة السر مطلوبة",
    }),
  });

  return schema.validate(obj);
};

// Validation Login Student
const validateLoginStudent = (obj: IStudent): joi.ValidationResult => {
  const schema = joi.object({
    email: joi.string().email().min(3).max(100).required().messages({
      "string.email": "البريد الإلكتروني غير صالح",
      "string.empty": "البريد الإلكتروني مطلوب",
      "string.min": "البريد الإلكتروني يجب أن يكون على الأقل 3 أحرف",
      "string.max": "البريد الإلكتروني يجب ألا يتجاوز 100 حرف",
      "any.required": "البريد الإلكتروني مطلوب",
    }),
    password: joi.string().min(8).required().messages({
      "string.min": "كلمة السر يجب أن تكون على الأقل 8 أحرف",
      "string.empty": "كلمة السر مطلوبة",
      "any.required": "كلمة السر مطلوبة",
    }),
  });

  return schema.validate(obj);
};

// Validation Send Eamil
const validateSendEmail = (obj: IStudent): joi.ValidationResult => {
  const schema = joi.object({
    email: joi.string().email().min(3).max(100).required().messages({
      "string.email": "البريد الإلكتروني غير صالح",
      "string.empty": "البريد الإلكتروني مطلوب",
      "string.min": "البريد الإلكتروني يجب أن يكون على الأقل 3 أحرف",
      "string.max": "البريد الإلكتروني يجب ألا يتجاوز 100 حرف",
      "any.required": "البريد الإلكتروني مطلوب",
    }),
  });

  return schema.validate(obj);
};

// Validation Reset Pass
const validateResetPass = (obj: IStudent): joi.ValidationResult => {
  const schema = joi.object({
    otp: joi.string().length(5).required().messages({
      "string.empty": "لا يمكن أن يكون فارغاً",
      "any.required": "مطلوب",
    }),
  });

  return schema.validate(obj);
};

// Validation Password
const validatePasswourd = (obj: IStudent): joi.ValidationResult => {
  const schema = joi.object({
    password: joi.string().min(8).required().messages({
      "string.min": "كلمة السر يجب أن تكون على الأقل 8 أحرف",
      "string.empty": "كلمة السر مطلوبة",
      "any.required": "كلمة السر مطلوبة",
    }),
  });

  return schema.validate(obj);
};

// Validation Update Student
const validateUpdateStudent = (
  obj: Partial<IStudent>
): joi.ValidationResult => {
  const schema = joi.object({
    userName: joi.string().max(100).messages({
      "string.empty": "الاسم الكامل مطلوب",
      "string.max": "الاسم الكامل يجب ألا يتجاوز 100 حرف",
      "any.required": "الاسم الكامل مطلوب",
    }),
    phoneNumber: joi
      .string()
      .pattern(/^09[0-9]{8}$/)
      .messages({
        "string.pattern.base":
          "رقم الهاتف غير صالح! يجب أن يبدأ بـ 09 ويتكون من 10 أرقام.",
        "string.empty": "رقم الهاتف مطلوب",
        "any.required": "رقم الهاتف مطلوب",
      }),
  });

  return schema.validate(obj);
};

// Validation Update Important Student
const validateUpdateImportantStudent = (
  obj: Partial<IStudent>
): joi.ValidationResult => {
  const schema = joi.object({
    userName: joi.string().max(100).messages({
      "string.empty": "الاسم الكامل مطلوب",
      "string.max": "الاسم الكامل يجب ألا يتجاوز 100 حرف",
      "any.required": "الاسم الكامل مطلوب",
    }),
    phoneNumber: joi
      .string()
      .pattern(/^09[0-9]{8}$/)
      .messages({
        "string.pattern.base":
          "رقم الهاتف غير صالح! يجب أن يبدأ بـ 09 ويتكون من 10 أرقام.",
        "string.empty": "رقم الهاتف مطلوب",
        "any.required": "رقم الهاتف مطلوب",
      }),
    academicYear: joi.date().messages({
      "date.base": "صيغة السنة الدراسية غير صحيحة",
      "any.required": "السنة الدراسية مطلوبة",
    }),
    universityNumber: joi.number().messages({
      "string.empty": "الرقم الجامعي مطلوب",
      "any.required": "الرقم الجامعي مطلوب",
    }),
    birth: joi.date().messages({
      "date.base": "تاريخ الميلاد غير صالح",
      "any.required": "تاريخ الميلاد مطلوب",
    }),
    email: joi.string().email().min(3).max(100).messages({
      "string.email": "البريد الإلكتروني غير صالح",
      "string.empty": "البريد الإلكتروني مطلوب",
      "string.min": "البريد الإلكتروني يجب أن يكون على الأقل 3 أحرف",
      "string.max": "البريد الإلكتروني يجب ألا يتجاوز 100 حرف",
      "any.required": "البريد الإلكتروني مطلوب",
    }),
  });

  return schema.validate(obj);
};

const validateUpdateSuspendedStudent = (
  obj: Partial<IStudent>
): joi.ValidationResult => {
  const schema = joi.object({
    suspended: joi.boolean().required().messages({
      "any.required": "عملية التقييد مطلوب",
    }),
    suspensionReason: joi.string().required().messages({
      "any.required": "سبب التقييد مطلوب",
    }),
  });

  return schema.validate(obj);
};

export {
  Student,
  validationOtp,
  validateCreateStudent,
  validateUpdateStudent,
  validateLoginStudent,
  validateSendEmail,
  validateResetPass,
  validatePasswourd,
  validateUpdateSuspendedStudent,
  validateUpdateImportantStudent,
};

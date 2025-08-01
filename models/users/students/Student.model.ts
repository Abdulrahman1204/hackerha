import mongoose, { Schema, Model } from "mongoose";
import joi from "joi";
import { IOtp, IProfilePhoto, IStudent } from "./dtos";
import bcrypt from "bcrypt";

// Student Schema
const StudentSchema = new Schema(
  {
    profilePhoto: {
      type: Object,
      default: {
        url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        publicId: null,
      },
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
    university: {
      type: String,
      enum: {
        values: ["جامعة قرطبة", "جامعة إيبلا", "جامعة الشهباء", "جامعة حلب"],
        message:
          "الجامعة يجب ان تكون ( جامعة حلب أو جامعة الشهباء أو جامعة إيبلا أو جامعة قرطبة )",
      },
    },
    academicYear: {
      type: Date,
      required: [true, "السنة الدراسية مطلوبة"],
    },
    universityNumber: {
      type: String,
      required: [true, "الرقم الجامعي مطلوب"],
      trim: true,
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
    suspensionReason: String,
    suspensionEnd: Date,
  },
  {
    timestamps: true,
  }
);

// Student Model
const Student: Model<IStudent> = mongoose.model<IStudent>(
  "Student",
  StudentSchema
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

// Student Indexes
StudentSchema.index({ createdAt: -1 });

// Validation Check Otp
const validationOtp = (obj: IOtp): joi.ValidationResult => {
  const schema = joi.object({
    otp: joi.string().required().messages({
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
    university: joi
      .string()
      .valid("جامعة قرطبة", "جامعة إيبلا", "جامعة الشهباء", "جامعة حلب")
      .required()
      .messages({
        "any.only":
          "الجامعة يجب ان تكون ( جامعة حلب أو جامعة الشهباء أو جامعة إيبلا أو جامعة قرطبة )",
        "any.required": "الجامعة مطلوبة",
      }),
    academicYear: joi.date().required().messages({
      "date.base": "صيغة السنة الدراسية غير صحيحة",
      "any.required": "السنة الدراسية مطلوبة",
    }),
    universityNumber: joi.string().required().messages({
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

// Validation Update Student
const validateUpdateStudent = (
  obj: Partial<IStudent>
): joi.ValidationResult => {
  const schema = joi.object({
    userName: joi.string().max(100).optional(),
    phoneNumber: joi
      .string()
      .pattern(/^09[0-9]{8}$/)
      .optional()
      .messages({
        "string.pattern.base":
          "رقم الهاتف غير صالح! يجب أن يبدأ بـ 09 ويتكون من 10 أرقام.",
      }),
    university: joi
      .string()
      .valid("جامعة قرطبة", "جامعة إيبلا", "جامعة الشهباء", "جامعة حلب")
      .optional(),
    academicYear: joi.date().optional(),
    universityNumber: joi.string().optional(),
    birth: joi.date().optional(),
    email: joi.string().email().min(3).max(100).optional(),
    password: joi.string().min(8).optional(),
  });

  return schema.validate(obj);
};

// Validation for updating profilePhoto only
const validateUpdateProfilePhoto = (
  obj: Partial<IProfilePhoto>
): joi.ValidationResult => {
  const schema = joi.object({
    profilePhoto: joi
      .object({
        url: joi.string().uri().required(),
        publicId: joi.string().required(),
      })
      .required()
      .messages({
        "object.base": "يجب أن تكون صورة الملف الشخصي كائنًا",
        "any.required": "صورة الملف الشخصي مطلوبة",
      }),
  });

  return schema.validate(obj);
};

export {
  Student,
  validationOtp,
  validateCreateStudent,
  validateUpdateStudent,
  validateUpdateProfilePhoto,
  validateLoginStudent,
};

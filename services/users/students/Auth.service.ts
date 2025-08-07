import {
  BadRequestError,
  NotFoundError,
} from "../../../middlewares/handleErrors";
import { IOtp, IStudent } from "../../../models/users/students/dtos";
import {
  Student,
  validateCreateStudent,
  validateLoginStudent,
  validationOtp,
} from "../../../models/users/students/Student.model";
import { OTPUtils } from "../../../utils/generateOtp";
import { generateJWT } from "../../../utils/generateToken";
import { sendEmail } from "../../../utils/mailer";
import { html } from "../../../utils/mailHtml";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthStudentService {
  // ~ Post => /api/hackit/ctrl/student/register ~ Create New Student
  static async createNewStudent(studentData: IStudent) {
    const { error } = validateCreateStudent(studentData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const existingInactiveByEmail = await Student.findOne({
      email: studentData.email,
      available: false,
    });
    if (existingInactiveByEmail) {
      await Student.findByIdAndDelete(existingInactiveByEmail._id);
    }

    const [existingByPhone, existingByEmail] = await Promise.all([
      Student.findOne({ phoneNumber: studentData.phoneNumber }),
      Student.findOne({ email: studentData.email, available: true }),
    ]);

    if (existingByPhone) {
      throw new BadRequestError("رقم الهاتف مسجل مسبقاً");
    }

    if (existingByEmail) {
      throw new BadRequestError("البريد الإلكتروني مسجل مسبقاً");
    }

    const otp = OTPUtils.generateOTP();
    const hashedOtp = await OTPUtils.encryptOTP(otp);

    const student = await Student.create({
      userName: studentData.userName,
      phoneNumber: studentData.phoneNumber,
      university: studentData.university,
      academicYear: studentData.academicYear,
      universityNumber: studentData.universityNumber,
      birth: studentData.birth,
      email: studentData.email,
      password: studentData.password,
      otp: hashedOtp,
      available: false,
    });

    try {
      await sendEmail({
        to: student.email,
        subject: "رمز التحقق - حساب طالب",
        text: `رمز التحقق الخاص بك هو: ${otp}`,
        html: html(otp),
      });
    } catch (emailError) {
      await Student.findByIdAndDelete(student._id);
      console.error("Failed to send email:", emailError);
      throw new Error("فشل في إرسال بريد التحقق، يرجى المحاولة مرة أخرى");
    }

    return {
      message: "تم إنشاء الحساب بنجاح، يرجى التحقق من بريدك الإلكتروني",
      id: student.id,
    };
  }

  // ~ Post => /api/hackit/ctrl/student/verifyotp/:id ~ verifyOtp
  static async verifyOtp(otpData: IOtp, studentId: string) {
    const { error } = validationOtp(otpData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const student = await Student.findById(studentId);
    if (!student) {
      throw new NotFoundError("الحساب غير موجود");
    }

    if (student.available) {
      throw new BadRequestError("الحساب مفعل بالفعل");
    }

    const isValidOtp = await OTPUtils.verifyOTP(otpData.otp, student.otp);
    console.log({isValidOtp: isValidOtp})
    if (!isValidOtp) {
      throw new BadRequestError("رمز التحقق غير صحيح");
    }

  
    const token = generateJWT({
      id: studentId,
      role: "student",
    });

    student.available = true;
    student.otp = "";
    await student.save();

    return { message: "تم تفعيل الحساب بنجاح", token };
  }

  // ~ Post => /api/hackit/ctrl/student/login ~ Login Student
  static async loginStudent(studentData: IStudent) {
    const { error } = validateLoginStudent(studentData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const existingInStudent = await Student.findOne({
      email: studentData.email,
      available: true,
    });
    if (!existingInStudent) {
      throw new NotFoundError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }

    const isPasswordValid = await bcrypt.compare(
      studentData.password,
      existingInStudent.password
    );
    if (!isPasswordValid) {
      throw new BadRequestError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }

    const token = generateJWT({
      id: existingInStudent.id,
      role: "student",
    });

    return { message: "تم تسجيل الدخول بنجاح", token };
  }
}

export { AuthStudentService };

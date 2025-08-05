import {
  BadRequestError,
  NotFoundError,
} from "../../../middlewares/handleErrors";
import { IOtp, IStudent } from "../../../models/users/students/dtos";
import {
  Student,
  validateUpdateProfilePhoto,
  validateUpdateStudent,
  validateSendEmail,
  validateResetPass,
  validatePasswourd,
} from "../../../models/users/students/Student.model";
import { OTPUtils } from "../../../utils/generateOtp";
import { sendEmail } from "../../../utils/mailer";
import { html } from "../../../utils/mailHtml";
import bcrypt from "bcrypt";

class CtrlStudentService {
  // ~ Post => /api/hackit/ctrl/student/sendemailpassword ~ Send Email For Password For Student
  static async SendEmailForPasswordStudent(studentData: IStudent) {
    const { error } = validateSendEmail(studentData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const existingInactiveByEmail = await Student.findOne({
      email: studentData.email,
      available: true,
    });
    if (!existingInactiveByEmail) {
      throw new BadRequestError("البريد الإلكتروني غير موجود");
    }

    const otp = OTPUtils.generateOTP();
    const hashedOtp = await OTPUtils.encryptOTP(otp);

    existingInactiveByEmail.otp = hashedOtp;
    existingInactiveByEmail.resetPass = false;
    await existingInactiveByEmail.save();

    try {
      await sendEmail({
        to: existingInactiveByEmail.email,
        subject: "رمز اعادة تعيين كلمة السر - حساب طالب",
        text: `رمز التحقق الخاص بك هو: ${otp}`,
        html: html(otp),
      });
    } catch (emailError) {
      await Student.findByIdAndDelete(existingInactiveByEmail._id);
      console.error("Failed to send email:", emailError);
      throw new Error("فشل في إرسال بريد التحقق، يرجى المحاولة مرة أخرى");
    }

    return {
      message: "تم إرسال كود التحقق الخاص بك، يرجى التحقق من بريدك الإلكتروني",
      id: existingInactiveByEmail.id,
    };
  }

  // ~ Post => /api/hackit/ctrl/student/forgetPass/:id ~ Forget Password For Student
  static async ForgetPasswordStudent(studentData: IStudent, id: string) {
    const { error } = validateResetPass(studentData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const existingInactiveById = await Student.findById(id);
    if (!existingInactiveById) {
      throw new BadRequestError("المستخدم غير موجود");
    }

    if (!existingInactiveById.available) {
      throw new BadRequestError("الحساب غير بالفعل");
    }

    const isValidOtp = await OTPUtils.verifyOTP(
      studentData.otp,
      existingInactiveById.otp
    );
    if (!isValidOtp) {
      throw new BadRequestError("رمز التحقق غير صحيح");
    }

    existingInactiveById.otp = "";
    existingInactiveById.resetPass = true;
    await existingInactiveById.save();

    return { message: "تم التحقق من الكود" };
  }

  // ~ Put => /api/hackit/ctrl/student/changepass/:id ~ Change Password For Student
  static async ChagePasswordStudent(studentData: IStudent, id: string) {
    const { error } = validatePasswourd(studentData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const existingInactiveById = await Student.findById(id);
    if (!existingInactiveById) {
      throw new BadRequestError("المستخدم غير موجود");
    }

    if (!existingInactiveById.available) {
      throw new BadRequestError("الحساب غير بالفعل");
    }

    if (!existingInactiveById.resetPass) {
      throw new BadRequestError("غير مسموح لك بتغيير كلمة السر");
    }

    const isSamePassword = await bcrypt.compare(
      studentData.password,
      existingInactiveById.password
    );
    if (isSamePassword) {
      throw new BadRequestError(
        "كلمة السر الجديدة يجب أن تكون مختلفة عن القديمة"
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(studentData.password, salt);

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        $set: {
          password: hashedPassword,
          resetPass: false,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      throw new Error("فشل تحديث كلمة السر");
    }

    return { message: "تم تحديث كلمة السر بنجاح" };
  }
}

export { CtrlStudentService };

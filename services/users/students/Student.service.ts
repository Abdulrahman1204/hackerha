import {
  BadRequestError,
  NotFoundError,
} from "../../../middlewares/handleErrors";
import { IOtp, IStudent } from "../../../models/users/students/dtos";
import {
  Student,
  validateUpdateStudent,
  validateSendEmail,
  validateResetPass,
  validatePasswourd,
  validateUpdateSuspendedStudent,
  validateUpdateImportantStudent,
} from "../../../models/users/students/Student.model";
import { OTPUtils } from "../../../utils/generateOtp";
import { sendEmail } from "../../../utils/mailer";
import { html } from "../../../utils/mailHtml";
import bcrypt from "bcrypt";
import { ICloudinaryFile } from "../../../utils/types";
import { Course } from "../../../models/courses/Course.model";
import { Types } from "mongoose";
import { Session } from "../../../models/courses/session/Session.model";
import { Bank } from "../../../models/banks/Bank.model";

class CtrlStudentService {
  // ~ Get => /api/hackit/ctrl/student/accountprofilestudent ~ Get Profile Student
  static async getProfileStudent(id: string) {
    const existingInactiveById = await Student.findById(id);
    if (!existingInactiveById) {
      throw new BadRequestError("المستخدم غير موجود");
    }

    if (!existingInactiveById.available) {
      throw new BadRequestError("الحساب غير مفعل");
    }

    if (existingInactiveById.suspended) {
      throw new BadRequestError("حسابك مقيد");
    }

    const student = await Student.findById(id)
      .select(
        "-password -otp -suspended -available -resetPass -createdAt -updatedAt -__v"
      )
      .populate("favoriteCourses favoriteSessions");

    return student;
  }

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

    if (!existingInactiveByEmail.available) {
      throw new BadRequestError("الحساب غير مفعل");
    }

    if (existingInactiveByEmail.suspended) {
      throw new BadRequestError("حسابك مقيد");
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
      throw new BadRequestError("الحساب غير مفعل");
    }

    if (existingInactiveById.suspended) {
      throw new BadRequestError("حسابك مقيد");
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
      throw new BadRequestError("الحساب غير مفعل");
    }

    if (existingInactiveById.suspended) {
      throw new BadRequestError("حسابك مقيد");
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

  // ~ Put => /api/hackit/ctrl/student/updatedetailsprofile/:id ~ Change details of student
  static async UpdateProfileStudent(studentData: IStudent, id: string) {
    const { error } = validateUpdateStudent(studentData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const existingInactiveById = await Student.findById(id);
    if (!existingInactiveById) {
      throw new BadRequestError("المستخدم غير موجود");
    }

    if (!existingInactiveById.available) {
      throw new BadRequestError("الحساب غير مفعل");
    }

    if (existingInactiveById.suspended) {
      throw new BadRequestError("حسابك مقيد");
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        $set: {
          userName: studentData.userName,
          phoneNumber: studentData.phoneNumber,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      throw new Error("فشل تحديث معلومات الطالب");
    }

    return { message: "تم التحديث بنجاح" };
  }

  // ~ Put => /api/hackit/ctrl/student/UpdateProfileSuspendedStudent/:id ~ Change Suspended of student
  static async UpdateProfileSuspendedStudent(
    studentData: IStudent,
    id: string
  ) {
    const { error } = validateUpdateSuspendedStudent(studentData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const existingInactiveById = await Student.findById(id);
    if (!existingInactiveById) {
      throw new BadRequestError("المستخدم غير موجود");
    }

    if (!existingInactiveById.available) {
      throw new BadRequestError("الحساب غير مفعل");
    }

    if (existingInactiveById.suspended) {
      throw new BadRequestError("حسابك مقيد");
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        $set: {
          suspended: studentData.suspended,
          suspensionReason: studentData.suspensionReason,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      throw new Error("فشل في تقييد الحساب");
    }

    return { message: "تم تقييد الحساب بنجاح" };
  }

  // ~ Put => /api/hackit/ctrl/student/UpdateProfileImpStudentAdmin/:id ~ Change important details of student
  static async UpdateProfileImpStudentAdmin(studentData: IStudent, id: string) {
    const { error } = validateUpdateImportantStudent(studentData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const existingInactiveById = await Student.findById(id);
    if (!existingInactiveById) {
      throw new BadRequestError("المستخدم غير موجود");
    }

    if (!existingInactiveById.available) {
      throw new BadRequestError("الحساب غير مفعل");
    }

    if (existingInactiveById.suspended) {
      throw new BadRequestError("حسابك مقيد");
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        $set: {
          userName: studentData.userName,
          phoneNumber: studentData.phoneNumber,
          university: studentData.university,
          academicYear: studentData.academicYear,
          universityNumber: studentData.universityNumber,
          gender: studentData.gender,
          birth: studentData.birth,
          email: studentData.email,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      throw new Error("فشل تحديث معلومات الطالب");
    }

    return { message: "تم التحديث بنجاح" };
  }

  // ~ Put => /api/hackit/ctrl/student/updateimageprofile/:id ~ Change Image of student
  static async UpdateImageProfileStudent(file: ICloudinaryFile, id: string) {
    const existingInactiveById = await Student.findById(id);
    if (!existingInactiveById) {
      throw new BadRequestError("المستخدم غير موجود");
    }

    if (!existingInactiveById.available) {
      throw new BadRequestError("الحساب غير مفعل");
    }

    if (existingInactiveById.suspended) {
      throw new BadRequestError("حسابك مقيد");
    }

    console.log(file);

    if (!file) {
      throw new BadRequestError("صورة الملف الشخصي مطلوبة");
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        $set: {
          profilePhoto: file.path,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedStudent) {
      throw new Error("فشل تحديث صورة الملف الشخصي");
    }

    return {
      message: "تم تحديث صورة الملف الشخصي بنجاح",
    };
  }

  // ~ Delete => /api/hackit/ctrl/student/account/:id ~ Delete Student Account
  static async DeleteStudentAccount(id: string) {
    const existingInactiveById = await Student.findById(id);
    if (!existingInactiveById) {
      throw new BadRequestError("المستخدم غير موجود");
    }

    if (!existingInactiveById.available) {
      throw new BadRequestError("الحساب غير مفعل");
    }

    if (existingInactiveById.suspended) {
      throw new BadRequestError("حسابك مقيد");
    }

    const deleteAccount = await Student.findByIdAndDelete(id);

    if (!deleteAccount) {
      throw new Error("فشل في حذف الحساب");
    }

    return {
      message: "تم حذف الحساب بنجاح",
    };
  }

  // ~ patch /api/hackit/ctrl/student/favorite/course/:courseId/toggle/:id
  static async toggleFavoriteCourse(
    studentId: string,
    courseId: string
  ): Promise<{ message: string; action: "added" | "removed" }> {
    const student = await Student.findById(studentId);
    if (!student) throw new NotFoundError("الطالب غير موجود");

    const course = await Course.findById(courseId);
    if (!course) throw new NotFoundError("الكورس غير موجود");

    const courseObjectId = new Types.ObjectId(courseId);
    const index = student.favoriteCourses.indexOf(courseObjectId);

    let action: "added" | "removed";

    if (index === -1) {
      // إضافة إلى المفضلة
      student.favoriteCourses.push(courseObjectId);
      action = "added";
    } else {
      // إزالة من المفضلة
      student.favoriteCourses.splice(index, 1);
      action = "removed";
    }

    await student.save();

    return {
      message:
        action === "added"
          ? "تمت إضافة الكورس إلى المفضلة"
          : "تمت إزالة الكورس من المفضلة",
      action,
    };
  }

  // ~ patch /api/hackit/ctrl/student/favorite/session/:sessionId/toggle/:id
  static async toggleFavoriteSession(
    studentId: string,
    sessionId: string
  ): Promise<{
    message: string;
    action: "added" | "removed";
  }> {
    const student = await Student.findById(studentId);
    if (!student) throw new NotFoundError("الطالب غير موجود");

    const session = await Session.findById(sessionId);
    if (!session) throw new NotFoundError("الجلسة غير موجودة");

    const sessionObjectId = new Types.ObjectId(sessionId);
    const index = student.favoriteSessions.indexOf(sessionObjectId);

    let action: "added" | "removed";

    if (index === -1) {
      // إضافة إلى المفضلة
      student.favoriteSessions.push(sessionObjectId);
      action = "added";
    } else {
      // إزالة من المفضلة
      student.favoriteSessions.splice(index, 1);
      action = "removed";
    }

    await student.save();

    return {
      message:
        action === "added"
          ? "تمت إضافة الجلسة إلى المفضلة"
          : "تمت إزالة الجلسة من المفضلة",
      action,
    };
  }

  // ~ patch /api/hackit/ctrl/student/favorite/bank/:bankId/toggle/:id
  static async toggleFavoriteBank(
    studentId: string,
    bankId: string
  ): Promise<{
    message: string;
    action: "added" | "removed";
  }> {
    const student = await Student.findById(studentId);
    if (!student) throw new NotFoundError("الطالب غير موجود");

    const bank = await Bank.findById(bankId);
    if (!bank) throw new NotFoundError("البنك غير موجودة");

    const bankObjectId = new Types.ObjectId(bankId);
    const index = student.favoriteBank.indexOf(bankObjectId);

    let action: "added" | "removed";

    if (index === -1) {
      // إضافة إلى المفضلة
      student.favoriteBank.push(bankObjectId);
      action = "added";
    } else {
      // إزالة من المفضلة
      student.favoriteBank.splice(index, 1);
      action = "removed";
    }

    await student.save();

    return {
      message:
        action === "added"
          ? "تمت إضافة البنك إلى المفضلة"
          : "تمت إزالة البنك من المفضلة",
      action,
    };
  }
}

export { CtrlStudentService };

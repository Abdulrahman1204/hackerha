import mongoose from "mongoose";

import crypto from "crypto";
import {
  PaymentCode,
  validateCreatePaymentCode,
  validateUsePaymentCode,
} from "../../models/payment/paymentCode/PaymentCode.model";
import { Course } from "../../models/courses/Course.model";
import { Student } from "../../models/users/students/Student.model";
import { BadRequestError, NotFoundError } from "../../middlewares/handleErrors";
import { Enrollment } from "../../models/payment/enrollment/Enrollment.model";

// Define proper types for the service methods
interface GeneratePaymentData {
  universityNumber: number;
  courseId: string;
}

interface VerifyPaymentData {
  code: string;
  universityNumber: number;
  studentId: string;
}

class PaymentService {
  // ~ POST /api/payment/code ~ Generate payment code
  static async generatePaymentCode(paymentData: GeneratePaymentData) {
    const { error } = validateCreatePaymentCode(paymentData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    // Check if course exists and is not free
    const course = await Course.findById(paymentData.courseId);
    if (!course) {
      throw new NotFoundError("الكورس غير موجود");
    }
    if (course.free) {
      throw new BadRequestError("هذا الكورس مجاني ولا يحتاج إلى دفع");
    }

    // Check if student exists with this university number
    const student = await Student.findOne({
      universityNumber: paymentData.universityNumber,
    });
    if (!student) {
      throw new NotFoundError("الطالب غير موجود");
    }

    // Check if student is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      studentId: student._id,
      courseId: paymentData.courseId,
    });
    if (existingEnrollment) {
      throw new BadRequestError("الطالب مسجل بالفعل في هذا الكورس");
    }

    // Generate random code (6 digits)
    const rawCode = crypto.randomInt(100000, 999999).toString();

    // Set expiration to 24 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Create payment code
    const paymentCode = await PaymentCode.create({
      code: rawCode,
      universityNumber: paymentData.universityNumber,
      courseId: new mongoose.Types.ObjectId(paymentData.courseId),
      studentId: student._id,
      expiresAt,
    });

    return {
      message: "تم إنشاء كود الدفع بنجاح",
      code: rawCode, // Return the raw code only once
      expiresAt,
    };
  }

  // ~ POST /api/payment/verify ~ Verify and use payment code
  static async verifyPaymentCode(verificationData: VerifyPaymentData) {
    const { error } = validateUsePaymentCode(verificationData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    // Check if student exists
    const student = await Student.findById(verificationData.studentId);
    if (!student) {
      throw new NotFoundError("الطالب غير موجود");
    }

    // Verify university number matches
    if (student.universityNumber !== verificationData.universityNumber) {
      throw new BadRequestError("الرقم الجامعي غير مطابق");
    }

    // Find valid payment codes for this university number
    const paymentCodes = await PaymentCode.find({
      universityNumber: verificationData.universityNumber,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (paymentCodes.length === 0) {
      throw new NotFoundError("لا توجد أكواد دفع صالحة");
    }

    // Check each code to find the matching one
    let validPaymentCode: any = null;
    for (const code of paymentCodes) {
      // Use type assertion to access the compareCode method
      const paymentCodeDoc = code as any;
      const isMatch = await paymentCodeDoc.compareCode(verificationData.code);
      if (isMatch) {
        validPaymentCode = paymentCodeDoc;
        break;
      }
    }

    if (!validPaymentCode) {
      throw new BadRequestError("كود الدفع غير صحيح أو منتهي الصلاحية");
    }

    // Check if course exists
    const course = await Course.findById(validPaymentCode.courseId);
    if (!course) {
      throw new NotFoundError("الكورس غير موجود");
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      studentId: student._id,
      courseId: validPaymentCode.courseId,
    });
    if (existingEnrollment) {
      throw new BadRequestError("الطالب مسجل بالفعل في هذا الكورس");
    }

    // Start transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Mark payment code as used
      validPaymentCode.used = true;
      validPaymentCode.studentId = student._id;
      await validPaymentCode.save({ session });

      // Create enrollment
      const enrollment = await Enrollment.create(
        [
          {
            studentId: student._id,
            courseId: validPaymentCode.courseId,
            paymentCode: verificationData.code,
            enrolledAt: new Date(),
          },
        ],
        { session }
      );

      // Add course to student's enrolled courses
      await Student.findByIdAndUpdate(
        student._id,
        { $addToSet: { enrolledCourses: validPaymentCode.courseId } },
        { session }
      );

      await Course.findByIdAndUpdate(
        validPaymentCode.courseId,
        { $addToSet: { students: student._id } },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return {
        message: "تم تفعيل الكود وتسجيل الكورس بنجاح",
        course: {
          _id: course._id,
          name: course.name,
          image: course.image,
        },
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  // ~ GET /api/payment/codes/:universityNumber ~ Get payment codes for student
  static async getStudentPaymentCodes(universityNumber: number) {
    const paymentCodes = await PaymentCode.find({
      universityNumber,
      expiresAt: { $gt: new Date() },
    })
      .populate("courseId", "name image price")
      .select("code used expiresAt courseId createdAt")
      .sort({ createdAt: -1 });

    return {
      paymentCodes: paymentCodes.map((code) => ({
        _id: code._id,
        course: code.courseId,
        used: code.used,
        expiresAt: code.expiresAt,
        createdAt: code.createdAt,
      })),
    };
  }

  // ~ GET /api/payment/enrollments/:studentId ~ Get student enrollments
  static async getStudentEnrollments(studentId: string) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      throw new BadRequestError("معرف الطالب غير صالح");
    }

    const enrollments = await Enrollment.find({ studentId })
      .populate("courseId", "name image description price rating")
      .sort({ enrolledAt: -1 });

    return { enrollments };
  }
}

export { PaymentService };

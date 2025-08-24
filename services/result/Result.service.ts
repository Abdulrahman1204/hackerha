import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../../middlewares/handleErrors";
import {
  Result,
  validateCreateResult,
  validateUpdateResult,
} from "../../models/results/Result.model";
import { IResult } from "../../models/results/dtos";
import { Student } from "../../models/users/students/Student.model";

class CtrlResultService {
  // ~ Get => /api/univers/ctrl/result ~ Get All Results (with optional filters)
  static async getAllResults(
    studentId?: string,
    minTotal?: number,
    maxTotal?: number,
    page: number = 1,
    limit: number = 10
  ) {
    const filter: any = {};

    if (studentId) {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new BadRequestError("معرف الطالب غير صالح");
      }
      filter.studentId = studentId;
    }

    if (minTotal !== undefined || maxTotal !== undefined) {
      filter.total = {};
      if (minTotal !== undefined) filter.total.$gte = minTotal;
      if (maxTotal !== undefined) filter.total.$lte = maxTotal;
    }

    const results = await Result.find(filter)
      .populate("studentId", "userName profilePhoto")
      .sort({ createdAt: -1 })
      .skip(limit * (page - 1))
      .limit(limit);

    const total = await Result.countDocuments(filter);

    return {
      results,
      filterNum: results.length,
      total,
    };
  }

  // ~ Get => /api/univers/ctrl/result/:id ~ Get Result by ID
  static async getResultById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف النتيجة غير صالح");
    }

    const result = await Result.findById(id).populate(
      "studentId",
      "userName profilePhoto"
    );

    if (!result) {
      throw new NotFoundError("النتيجة غير موجودة");
    }

    return result;
  }

  // ~ Get => /api/univers/ctrl/result/student/:studentId ~ Get Results by Student ID
  static async getResultsByStudent(
    studentId: string,
    page: number = 1,
    limit: number = 10
  ) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      throw new BadRequestError("معرف الطالب غير صالح");
    }

    const results = await Result.find({ studentId })
      .populate("studentId", "userName profilePhoto")
      .sort({ createdAt: -1 })
      .skip(limit * (page - 1))
      .limit(limit);

    const total = await Result.countDocuments({ studentId });

    return {
      results,
      filterNum: results.length,
      total,
    };
  }

  // ~ Post => /api/univers/ctrl/result ~ Create New Result
  static async createResult(resultData: IResult) {
    const { error } = validateCreateResult(resultData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        resultData.studentId as unknown as string
      )
    ) {
      throw new BadRequestError("معرف الطالب غير صالح");
    }

    // Check if student exists
    const studentExists = await Student.findById(resultData.studentId);
    if (!studentExists) {
      throw new NotFoundError("الطالب غير موجود");
    }

    // Validate that numbers make sense
    if (
      resultData.numOfRight + resultData.numOfWrong !==
      resultData.questionNum
    ) {
      throw new BadRequestError(
        "عدد الإجابات الصحيحة والخاطئة يجب أن يساوي عدد الأسئلة"
      );
    }

    const result = await Result.create(resultData);
    await result.populate("studentId", "userName profilePhoto");
    if (!result) {
      throw new BadRequestError("فشل في إنشاء النتيجة");
    }

    return { message: "تم إضافة النتيجة بنجاح" };
  }

  // ~ Put => /api/univers/ctrl/result/:id ~ Update Result
  static async updateResult(resultData: Partial<IResult>, id: string) {
    const { error } = validateUpdateResult(resultData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف النتيجة غير صالح");
    }

    if (
      resultData.studentId &&
      !mongoose.Types.ObjectId.isValid(
        resultData.studentId as unknown as string
      )
    ) {
      throw new BadRequestError("معرف الطالب غير صالح");
    }

    const resultHave = await Result.findById(id);
    if (!resultHave) {
      throw new NotFoundError("النتيجة غير موجودة");
    }

    // Check if student exists (if provided)
    if (resultData.studentId) {
      const studentExists = await Student.findById(resultData.studentId);
      if (!studentExists) {
        throw new NotFoundError("الطالب غير موجود");
      }
    }

    const updatedResult = await Result.findByIdAndUpdate(
      id,
      { $set: resultData },
      { new: true, runValidators: true }
    ).populate("studentId", "userName profilePhoto");

    if (!updatedResult) {
      throw new NotFoundError("النتيجة غير موجودة");
    }

    return { message: "تم تحديث النتيجة بنجاح" };
  }

  // ~ Delete => /api/univers/ctrl/result/:id ~ Delete Result
  static async deleteResult(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف النتيجة غير صالح");
    }

    const deletedResult = await Result.findByIdAndDelete(id);
    if (!deletedResult) {
      throw new NotFoundError("النتيجة غير موجودة");
    }

    return { message: "تم حذف النتيجة بنجاح" };
  }
}

export { CtrlResultService };

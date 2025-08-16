import mongoose from "mongoose";
import {
  BadRequestError,
  NotFoundError,
} from "../../../middlewares/handleErrors";
import { Course } from "../../../models/courses/Course.model";
import { ISesson } from "../../../models/courses/sesson/dtos";
import {
  Sesson,
  validateCreateSesson,
  validateUpdateSesson,
} from "../../../models/courses/sesson/Sesson.model";
import { ICloudinaryFile } from "../../../utils/types";
import path from "path";

class CtrlSessonService {
  // ~ POST /api/sessons - Create a new sesson
  static async createSesson(sessonData: ISesson) {
    const { error } = validateCreateSesson(sessonData);
    if (error) throw new BadRequestError(error.details[0].message);

    const courseHave = await Course.findById(sessonData.courseId);
    if (!courseHave) {
      throw new NotFoundError("الكورس غير موجود");
    }

    const sessonHave = await Sesson.find({
      name: sessonData.name,
    });
    if (!sessonHave) {
      throw new BadRequestError("الجلسة موجودة بالفعل");
    }

    const sesson = await Sesson.create(sessonData);

    if (!sesson) throw new NotFoundError("فشل إنشاء الجلسة");


    return { message: "تم إنشاء الجلسة بنجاح" };
  }

  // ~ GET /api/sessons/:id - Get sesson by ID
  static async getSessonById(id: string) {
    const sesson = await Sesson.findById(id);

    if (!sesson) throw new NotFoundError("الجلسة غير موجودة");
    return sesson;
  }

  // ~ GET /api/courses/:courseId/sessons - Get all sessons for a course
  static async getSessonsByCourseId(courseId: string) {
    const sessons = await Sesson.find({ courseId });

    const courseHave = await Course.findById(courseId);
    if (!courseHave) {
      throw new NotFoundError("الكورس غير موجود");
    }

    return sessons;
  }

  // ~ PUT /api/sessons/:id - Update sesson
  static async updateSesson(id: string, sessonData: ISesson) {
    const { error } = validateUpdateSesson(sessonData);
    if (error) throw new BadRequestError(error.details[0].message);

    const sessonHave = await Sesson.findById(id);
    if (!sessonHave) {
      throw new NotFoundError("الحلسة غير موجوة");
    }

    const updatedSesson = await Sesson.findByIdAndUpdate(id, sessonData, {
      new: true,
      runValidators: true,
    });

    if (!updatedSesson) throw new NotFoundError("فشل تحديث الجلسة");

    return { message: "تم تحديث الجلسة بنجاح" };
  }

  // ~ DELETE /api/sessons/:id - Delete sesson
  static async deleteSesson(id: string) {
    const sessonHave = await Sesson.findById(id);
    if (!sessonHave) {
      throw new NotFoundError("الحلسة غير موجوة");
    }

    const deletedSesson = await Sesson.findByIdAndDelete(id);
    if (!deletedSesson) throw new NotFoundError("فشل حذف الجلسة");
    return { message: "تم حذف الجلسة بنجاح" };
  }

  // ~ PUT /api/sessons/:id/like - Like a sesson
  static async likeSesson(sessonId: string, studentId: string) {
    const sesson = await Sesson.findById(sessonId);
    if (!sesson) throw new NotFoundError("الجلسة غير موجودة");

    const studentObjectId = new mongoose.Types.ObjectId(studentId);

    const alreadyLikedIndex = sesson.likes.findIndex((id) =>
      id.equals(studentObjectId)
    );

    if (alreadyLikedIndex > -1) {
      sesson.likes.splice(alreadyLikedIndex, 1);
      await sesson.save();
      return { message: "تم إزالة الإعجاب بالجلسة" };
    }

    sesson.disLikes = sesson.disLikes.filter(
      (id) => !id.equals(studentObjectId)
    );

    sesson.likes.push(studentObjectId);
    await sesson.save();

    return { message: "تم الإعجاب بالجلسة بنجاح" };
  }

  // ~ PUT /api/sessons/:id/dislike - Dislike a sesson
  static async dislikeSesson(sessonId: string, studentId: string) {
    const sesson = await Sesson.findById(sessonId);
    if (!sesson) throw new NotFoundError("الجلسة غير موجودة");

    const studentObjectId = new mongoose.Types.ObjectId(studentId);

    const alreadyDislikedIndex = sesson.disLikes.findIndex((id) =>
      id.equals(studentObjectId)
    );

    if (alreadyDislikedIndex > -1) {
      sesson.disLikes.splice(alreadyDislikedIndex, 1);
      await sesson.save();
      return { message: "تم إزالة كره الجلسة" };
    }

    sesson.likes = sesson.likes.filter((id) => !id.equals(studentObjectId));

    sesson.disLikes.push(studentObjectId);
    await sesson.save();

    return { message: "تم كره الجلسة بنجاح" };
  }
}

export { CtrlSessonService };

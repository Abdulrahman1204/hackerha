import mongoose from "mongoose";
import {
  BadRequestError,
  NotFoundError,
} from "../../../middlewares/handleErrors";
import { Course } from "../../../models/courses/Course.model";
import { ISession } from "../../../models/courses/session/dtos";
import {
  Session,
  validateCreateSession,
  validateUpdateSession,
} from "../../../models/courses/session/Session.model";
import { ICloudinaryFile } from "../../../utils/types";
import path from "path";

class CtrlSessionService {
  // ~ POST /api/sessions - Create a new session
  static async createSession(sessionData: ISession) {
    const { error } = validateCreateSession(sessionData);
    if (error) throw new BadRequestError(error.details[0].message);

    const courseHave = await Course.findById(sessionData.courseId);
    if (!courseHave) {
      throw new NotFoundError("الكورس غير موجود");
    }

    const sessionHave = await Session.find({
      name: sessionData.name,
    });
    if (!sessionHave) {
      throw new BadRequestError("الجلسة موجودة بالفعل");
    }

    const session = await Session.create(sessionData);

    if (!session) throw new NotFoundError("فشل إنشاء الجلسة");

    return { message: "تم إنشاء الجلسة بنجاح" };
  }

  // ~ GET /api/sessions/:id - Get session by ID
  static async getSessionById(id: string) {
    const session = await Session.findById(id);

    if (!session) throw new NotFoundError("الجلسة غير موجودة");
    return session;
  }

  // ~ GET /api/courses/:courseId/sessions - Get all sessions for a course
  static async getSessionsByCourseId(courseId: string) {
    const sessons = await Session.find({ courseId });

    const courseHave = await Course.findById(courseId).sort({ createdAt: -1 });
    if (!courseHave) {
      throw new NotFoundError("الكورس غير موجود");
    }

    return sessons;
  }

  // ~ PUT /api/sessions/:id - Update sessions
  static async updateSession(id: string, sessionData: ISession) {
    const { error } = validateUpdateSession(sessionData);
    if (error) throw new BadRequestError(error.details[0].message);

    const sessionHave = await Session.findById(id);
    if (!sessionHave) {
      throw new NotFoundError("الحلسة غير موجوة");
    }

    const updatedSession = await Session.findByIdAndUpdate(id, sessionData, {
      new: true,
      runValidators: true,
    });

    if (!updatedSession) throw new NotFoundError("فشل تحديث الجلسة");

    return { message: "تم تحديث الجلسة بنجاح" };
  }

  // ~ DELETE /api/sessions/:id - Delete session
  static async deleteSession(id: string) {
    const sessionHave = await Session.findById(id);
    if (!sessionHave) {
      throw new NotFoundError("الحلسة غير موجوة");
    }

    const deletedSession = await Session.findByIdAndDelete(id);
    if (!deletedSession) throw new NotFoundError("فشل حذف الجلسة");
    return { message: "تم حذف الجلسة بنجاح" };
  }

  // ~ PUT /api/sessions/:id/like - Like a sesison
  static async likeSession(sessionId: string, studentId: string) {
    const session = await Session.findById(sessionId);
    if (!session) throw new NotFoundError("الجلسة غير موجودة");

    const studentObjectId = new mongoose.Types.ObjectId(studentId);

    const alreadyLikedIndex = session.likes.findIndex((id) =>
      id.equals(studentObjectId)
    );

    if (alreadyLikedIndex > -1) {
      session.likes.splice(alreadyLikedIndex, 1);
      await session.save();
      return { message: "تم إزالة الإعجاب بالجلسة" };
    }

    session.disLikes = session.disLikes.filter(
      (id) => !id.equals(studentObjectId)
    );

    session.likes.push(studentObjectId);
    await session.save();

    return { message: "تم الإعجاب بالجلسة بنجاح" };
  }

  // ~ PUT /api/sessions/:id/dislike - Dislike a sessions
  static async dislikeSession(sessionId: string, studentId: string) {
    const session = await Session.findById(sessionId);
    if (!session) throw new NotFoundError("الجلسة غير موجودة");

    const studentObjectId = new mongoose.Types.ObjectId(studentId);

    const alreadyDislikedIndex = session.disLikes.findIndex((id) =>
      id.equals(studentObjectId)
    );

    if (alreadyDislikedIndex > -1) {
      session.disLikes.splice(alreadyDislikedIndex, 1);
      await session.save();
      return { message: "تم إزالة كره الجلسة" };
    }

    session.likes = session.likes.filter((id) => !id.equals(studentObjectId));

    session.disLikes.push(studentObjectId);
    await session.save();

    return { message: "تم كره الجلسة بنجاح" };
  }
}

export { CtrlSessionService };

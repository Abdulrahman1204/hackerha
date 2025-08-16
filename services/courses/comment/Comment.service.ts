import { Types } from "mongoose";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../../../middlewares/handleErrors";
import {
  Comment,
  validateCreateComment,
  validateUpdateComment,
} from "../../../models/courses/comment/Comment.model";
import { IComment } from "../../../models/courses/comment/dtos";

import { Course } from "../../../models/courses/Course.model";
import { Student } from "../../../models/users/students/Student.model";

class CommentService {
  // POST /api/comment - Create comment (Student)
  static async createComment(commentData: IComment) {
    const { error } = validateCreateComment(commentData);
    if (error) throw new BadRequestError(error.details[0].message);

    const studentHave = await Student.findById(commentData.studentId);
    if (!studentHave) {
      throw new NotFoundError("الطالب غير موجود");
    }

    const courseHave = await Course.findById(commentData.courseId);
    if (!courseHave) {
      throw new NotFoundError("الكورس غير موجود");
    }

    // Check if student already commented on this course
    const existingComment = await Comment.findOne({
      courseId: commentData.courseId,
      studentId: commentData.studentId,
    });
    if (existingComment) {
      throw new BadRequestError("لقد قمت بتقييم هذا الكورس من قبل");
    }

    const comment = await Comment.create(commentData);

    if (!comment) throw new NotFoundError("فشل إنشاء التعليق");

    // Update course average rating
    await this.updateCourseRating(comment.courseId);

    return {
      message: "تم إضافة التعليق بنجاح",
    };
  }

  // GET /api/comment/course/:courseId - Get course comments (Public)
  static async getCourseComments(courseId: string) {
    const comments = await Comment.find({ courseId })
      .populate("studentId", "userName profilePhoto")
      .sort({ createdAt: -1 });

    return comments;
  }

  // PUT /api/comment/:id - Update comment (Owner)
  static async updateComment(
    commentId: string,
    studentId: string,
    updateData: IComment
  ) {
    const { error } = validateUpdateComment(updateData);
    if (error) throw new BadRequestError(error.details[0].message);

    const comment = await Comment.findById(commentId);
    if (!comment) throw new NotFoundError("التعليق غير موجود");

    if (comment.studentId.toString() !== studentId) {
      throw new ForbiddenError("غير مصرح لك بتعديل هذا التعليق");
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("studentId", "userName profilePhoto createdAt");

    if (!updatedComment) throw new NotFoundError("فشل تحديث التعليق");

    // Update course average rating if rating was changed
    if (updateData.rating) {
      await this.updateCourseRating(updatedComment.courseId);
    }

    return { message: "تم تحديث التعليق بنجاح", comment: updatedComment };
  }

  // DELETE /api/comment/:id - Delete comment (Owner or Admin)
  static async deleteComment(commentId: string, studentId: string) {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new NotFoundError("التعليق غير موجود");

    if (comment.studentId.toString() !== studentId) {
      throw new ForbiddenError("غير مصرح لك بحذف هذا التعليق");
    }

    await Comment.findByIdAndDelete(commentId);

    // Update course average rating
    await this.updateCourseRating(comment.courseId);

    return { message: "تم حذف التعليق بنجاح" };
  }

  private static async updateCourseRating(courseId: Types.ObjectId) {
    const result = await Comment.aggregate([
      { $match: { courseId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    if (result.length > 0) {
      await Course.findByIdAndUpdate(courseId, {
        rating: parseFloat(result[0].averageRating.toFixed(1)),
      });
    }
  }
}

export { CommentService };

import { BadRequestError, NotFoundError } from "../../middlewares/handleErrors";
import { ICourse } from "../../models/courses/dtos";
import {
  Course,
  validateCreateCourse,
  validateUpdateCourse,
} from "../../models/courses/Course.model";
import { ICloudinaryFile } from "../../utils/types";
import { Comment } from "../../models/courses/comment/Comment.model";
import { Session } from "../../models/courses/session/Session.model";

class CtrlCourseService {
  // ~ POST /api/hackit/ctrl/course - Create a new course
  static async createCourse(courseData: ICourse, file: ICloudinaryFile) {
    // Validate course data
    const { error } = validateCreateCourse(courseData);
    if (error) throw new BadRequestError(error.details[0].message);

    if (!file) {
      throw new BadRequestError("صورة الكورس مطلوبة");
    }

    const existingCourse = await Course.findOne({ name: courseData.name });
    if (existingCourse) {
      throw new BadRequestError("الكورس موجود بالفعل");
    }

    if (courseData.free) {
      courseData.price = 0;
    }

    // Create new course
    const course = await Course.create({
      ...courseData,
      discount: {
        dis: courseData.discount.dis,
        rate: courseData.discount.dis ? courseData.discount.rate : 0,
      },
      image: file.path,
    });

    if (!course) throw new NotFoundError("فشل إنشاء الكورس");

    return {
      message: "تم إنشاء الكورس بنجاح",
    };
  }

  // ~ GET /api/hackit/ctrl/course/:id - Get course by ID
  static async getCourseById(id: string) {
    const course = await Course.findById(id);
    if (!course) throw new NotFoundError("الكورس غير موجود");

    const comments = await Comment.find({ courseId: id })
      .populate("studentId", "userName profilePhoto")
      .sort({ createdAt: -1 });

    const session = await Session.find({ courseId: id }).sort({
      createdAt: -1,
    });

    const courseWithComments = {
      ...course.toObject(),
      comments,
      session,
    };

    return courseWithComments;
  }

  // ~ GET /api/hackit/ctrl/course - Get all courses
  static async getAllCourses(queryParams: {
    name?: string;
    type?: "نظري" | "عملي";
    hasDiscount?: boolean;
    year?: number;
    semester?: number;
    createdLessThanDays?: number;
  }) {
    const { name, type, hasDiscount, year, semester, createdLessThanDays } =
      queryParams;

    const filter: any = {};

    if (name) filter.name = { $regex: name, $options: "i" };
    if (type) filter.type = type;
    if (hasDiscount !== undefined) filter["discount.dis"] = hasDiscount;
    if (year) filter.year = year;
    if (semester) filter.semester = semester;

    if (createdLessThanDays) {
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - createdLessThanDays);
      filter.createdAt = { $gte: dateThreshold };
    }

    const courses = await Course.find(filter)
      .sort({ createdAt: -1 })
      .select("-__v");

    return courses;
  }

  // ~ PUT /api/hackit/ctrl/course/:id - Update course
  static async updateCourse(id: string, courseData: Partial<ICourse>) {
    const { error } = validateUpdateCourse(courseData);
    if (error) throw new BadRequestError(error.details[0].message);

    if (courseData.free === true) {
      courseData.price = 0;
    } else if (courseData.free === false && courseData.price === 0) {
      throw new BadRequestError("لا يمكن أن يكون الكورس مدفوعاً وسعره صفر");
    }

    if (courseData.discount?.dis && !courseData.discount.rate) {
      throw new BadRequestError("نسبة التخفيض مطلوبة عندما يكون هناك تخفيض");
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, courseData, {
      new: true,
      runValidators: true,
    }).select("-__v");

    if (!updatedCourse) throw new NotFoundError("فشل تحديث الكورس");

    return {
      message: "تم تحديث الكورس بنجاح",
    };
  }

  // ~ DELETE /api/hackit/ctrl/course/:id - Delete course
  static async deleteCourse(id: string) {
    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) throw new NotFoundError("فشل حذف الكورس");
    return { message: "تم حذف الكورس بنجاح" };
  }

  // ~ PUT /api/hackit/ctrl/course/imagecourse/:id - Update course image
  static async updateCourseImage(file: ICloudinaryFile, id: string) {
    if (!file) throw new BadRequestError("صورة الكورس مطلوبة");

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { $set: { image: file.path } },
      { new: true }
    );

    if (!updatedCourse) throw new NotFoundError("فشل تحديث صورة الكورس");

    return { message: "تم تحديث صورة الكورس بنجاح" };
  }
}

export { CtrlCourseService };

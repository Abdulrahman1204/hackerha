import {
  BadRequestError,
  NotFoundError,
} from "../../../../middlewares/handleErrors";
import { Exam } from "../../../../models/courses/exam/Exam.model";
import { IQuestion } from "../../../../models/courses/exam/question/dtos";
import {
  Question,
  validateCreateQuestion,
} from "../../../../models/courses/exam/question/Question.model";
import { Request } from "../../../../models/courses/exam/request/Request.model";
import { ICloudinaryFile } from "../../../../utils/types";
import mongoose from "mongoose";

class QuestionService {
  // ~ POST /api/hackit/ctrl/question - Create a new question
  static async createQuestion(
    questionData: IQuestion,
    file?: ICloudinaryFile
  ) {
    const { error } = validateCreateQuestion(questionData);
    if (error) throw new BadRequestError(error.details[0].message);

    if (!file) {
      throw new BadRequestError("صورة السؤال مطلوبة");
    }

    const existingExam = await Exam.findById(questionData.examId);
    if (existingExam) {
      throw new BadRequestError("السؤال موجود بالفعل");
    }

    const question = await Question.create({
      ...questionData,
      image: file.path,
    });

    if (!question) throw new NotFoundError("فشل إنشاء السؤال");

    return {
      message: "تم إنشاء السؤال بنجاح",
    };
  }

  // ~ Get /api/hackit/ctrl/question/:id - Get question
  static async getQuestionById(id: string) {
    const question = await Question.findById(id);
    if (!question) throw new NotFoundError("السؤال غير موجود");

    const requests = await Request.find({ questionId: id });

    const questionsWithRequests = {
      ...question.toObject(),
      requests,
    };

    return questionsWithRequests;
  }

  // ~ Get /api/hackit/ctrl/question/:examId - Get questions by exam id
  static async getQuestionsByExamId(examId: string) {
    const existingExam = await Exam.findById(examId);
    if (existingExam) {
      throw new BadRequestError("السؤال موجود بالفعل");
    }

    const question = await Question.find({ examId: examId })
        .sort({ createdAt: -1 })
        .select('-__v')

    return question;
  }
}

export { QuestionService };

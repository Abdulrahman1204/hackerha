import mongoose from "mongoose";
import {
  BadRequestError,
  NotFoundError,
} from "../../../../middlewares/handleErrors";
import { Exam } from "../../../../models/courses/exam/Exam.model";
import { IQuestion } from "../../../../models/courses/exam/question/dtos";
import {
  Question,
  validateCreateQuestion,
  validateUpdateQuestion,
} from "../../../../models/courses/exam/question/Question.model";
import { ICloudinaryFile } from "../../../../utils/types";
import { Request } from "../../../../models/courses/exam/request/Request.model";

class QuestionService {
  // Create new question
  static async createQuestion(questionData: IQuestion, file?: ICloudinaryFile) {
    const { error } = validateCreateQuestion(questionData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    if (
      !mongoose.Types.ObjectId.isValid(questionData.examId as unknown as string)
    ) {
      throw new BadRequestError("معرف الامتحان غير صالح");
    }

    // Check if exam exists
    const examExists = await Exam.findById(questionData.examId);
    if (!examExists) {
      throw new NotFoundError("الامتحان غير موجود");
    }

    const question = await Question.create({
      ...questionData,
      image: file ? file.path : "",
    });
    await question.populate("examId", "title");

    if (!question) throw new NotFoundError("فشل إنشاء السؤال");

    return { message: "تم إنشاء السؤال بنجاح" };
  }

  // Get question by ID
  static async getQuestionById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف السؤال غير صالح");
    }

    const question = await Question.findById(id).populate(
      "examId",
      "title courseId"
    );
    if (!question) {
      throw new NotFoundError("السؤال غير موجود");
    }

    const requests = await Request.find({ questionId: id }).sort({
      createdAt: -1,
    });

    const questionsWithRequest = {
      ...question.toObject(),
      requests,
    };

    return questionsWithRequest;
  }

  // Get questions Bank by exam ID
  static async getQuestionsByExamId(examId: string) {
    if (!mongoose.Types.ObjectId.isValid(examId)) {
      throw new BadRequestError("معرف الامتحان غير صالح");
    }

    const allQuestions = await Question.find({ examId }).populate({
      path: "requests",
      select: "text image answers",
      options: { sort: { createdAt: 1 } },
    });

    const limit: number = allQuestions.length;

    const shuffledQuestions = this.shuffleArray([...allQuestions]);

    return limit ? shuffledQuestions.slice(0, limit) : shuffledQuestions;
  }

  // Update question Bank
  static async updateQuestion(
    questionData: Partial<IQuestion>,
    id: string
  ) {
    const { error } = validateUpdateQuestion(questionData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف السؤال غير صالح");
    }

    if (
      questionData.examId &&
      !mongoose.Types.ObjectId.isValid(questionData.examId as unknown as string)
    ) {
      throw new BadRequestError("معرف الامتحان غير صالح");
    }

    // Check if exam exists (if provided)
    if (questionData.examId) {
      const examExists = await Exam.findById(questionData.examId);
      if (!examExists) {
        throw new NotFoundError("الامتحان غير موجود");
      }
    }

    const question = await Question.findById(id);
    if (!question) {
      throw new NotFoundError("السؤال غير موجود");
    }

    const updatedQuestion = await Question.findByIdAndUpdate(id, questionData, {
      new: true,
      runValidators: true,
    });

    if (!updatedQuestion) {
      throw new NotFoundError("فشل تحديث السؤال");
    }

    return { message: "تم تحديث السؤال بنجاح" };
  }

  // Update question image
  static async updateQuestionImage(id: string, file: ICloudinaryFile) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف السؤال غير صالح");
    }

    if (!file) {
      throw new BadRequestError("صورة السؤال مطلوبة");
    }

    const question = await Question.findById(id);
    if (!question) {
      throw new NotFoundError("السؤال غير موجود");
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { image: file.path },
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      throw new NotFoundError("فشل تحديث صورة السؤال");
    }

    return { message: "تم تحديث صورة السؤال بنجاح" };
  }

  // Delete question
  static async deleteQuestion(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف السؤال غير صالح");
    }

    const deletedQuestion = await Question.findByIdAndDelete(id);
    if (!deletedQuestion) {
      throw new NotFoundError("السؤال غير موجود");
    }

    return { message: "تم حذف السؤال بنجاح" };
  }

  // Delete questions by exam id
  static async deleteQuestionsByExamId(examId: string) {
    if (!mongoose.Types.ObjectId.isValid(examId)) {
      throw new BadRequestError("معرف الامتحان غير صالح");
    }

    const result = await Question.deleteMany({ examId });

    return {
      message: "تم حذف جميع أسئلة الامتحان بنجاح",
      deletedCount: result.deletedCount,
    };
  }

  // Delete question bank image
  static async deleteQuestionImage(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف السؤال غير صالح");
    }

    const question = await Question.findById(id)
    if (!question) {
      throw new NotFoundError("السؤال غير موجود");
    }

    const questionDeleteImage = await Question.findByIdAndUpdate(
      id,
      { image: "" },
      { new: true, runValidators: true }
    );

    if (!questionDeleteImage) {
      throw new NotFoundError("فشل حذف صورة السؤال بنجاح");
    }

    return {
      message: "تم حذف صورة السؤال بنجاح",
    };
  }

  // Shuffle Array => for make change in question order
  private static shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

export { QuestionService };

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

class QuestionService {
  // Create new question
  static async createQuestion(questionData: IQuestion) {
    const { error } = validateCreateQuestion(questionData);
    if (error) throw new BadRequestError(error.details[0].message);

    // Verify exam exists
    const exam = await Exam.findById(questionData.examId);
    if (!exam) throw new NotFoundError("الامتحان غير موجود");

    const question = await Question.create(questionData);

    if (!question) throw new NotFoundError("فشل إنشاء السؤال");

    return { message: "تم إنشاء السؤال بنجاح" };
  }

  // Get question by ID
  static async getQuestionById(id: string) {
    const question = await Question.findById(id).populate("examId", "title");
    if (!question) throw new NotFoundError("السؤال غير موجود");
    return question;
  }

  // Get questions by exam ID
  static async getQuestionsByExamId(examId: string, limit: number = 50) {
    const allQuestions = await Question.find({ examId })
      .populate("examId", "title")
      .lean();

    const shuffledQuestions = this.shuffleArray([...allQuestions]);

    return limit ? shuffledQuestions.slice(0, limit) : shuffledQuestions;
  }

  // Update question
  static async updateQuestion(
    questionId: string,
    updateData: Partial<IQuestion>
  ) {
    const { error } = validateUpdateQuestion(updateData);
    if (error) throw new BadRequestError(error.details[0].message);

    const questionHave = await Question.findById(questionId);
    if (!questionHave) throw new NotFoundError("السؤال غير موجود");

    const question = await Question.findByIdAndUpdate(questionId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!question) throw new NotFoundError("فشل تحديث السؤال");

    return { message: "تم تحديث السؤال بنجاح" };
  }

  // Delete question
  static async deleteQuestion(questionId: string) {
    const question = await Question.findByIdAndDelete(questionId);
    if (!question) throw new NotFoundError("السؤال غير موجود");
    return { message: "تم حذف السؤال بنجاح" };
  }

  // Update question image
  static async updateQuestionImage(questionId: string, file: ICloudinaryFile) {
    if (!file) throw new BadRequestError("صورة السؤال مطلوبة");

    const questionHave = await Question.findById(questionId);
    if (!questionHave) throw new NotFoundError("السؤال غير موجود");

    const question = await Question.findByIdAndUpdate(
      questionId,
      { image: file.path },
      { new: true }
    );

    if (!question) throw new NotFoundError("فشل تحديث صورة السؤال");

    return { message: "تم تحديث صورة السؤال بنجاح" };
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

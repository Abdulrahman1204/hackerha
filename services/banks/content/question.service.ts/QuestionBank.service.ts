import {
  BadRequestError,
  NotFoundError,
} from "../../../../middlewares/handleErrors";
import { Content } from "../../../../models/banks/content/Content.model";
import { IQuestionBank } from "../../../../models/banks/content/question/dtos";
import {
  QuestionBank,
  validateCreateQuestionBank,
  validateUpdateQuestionBank,
} from "../../../../models/banks/content/question/QuestionBank.model";
import { ICloudinaryFile } from "../../../../utils/types";

class QuestionBankService {
  // Create new question bank
  static async createQuestionBank(questionData: IQuestionBank) {
    const { error } = validateCreateQuestionBank(questionData);
    if (error) throw new BadRequestError(error.details[0].message);

    // Verify content exists
    const content = await Content.findById(questionData.contentId);
    if (!content) throw new NotFoundError("المحتوى غير موجود");

    const questionBank = await QuestionBank.create(questionData);

    if (!questionBank) throw new NotFoundError("فشل إنشاء السؤال");

    return { message: "تم إنشاء السؤال بنجاح" };
  }

  // Get question Bank by ID
  static async getQuestionBankById(id: string) {
    const questionBank = await QuestionBank.findById(id).populate(
      "contentId",
      "title"
    );
    if (!questionBank) throw new NotFoundError("السؤال غير موجود");
    return questionBank;
  }

  // Get questions Bank by exam ID
  static async getQuestionsBankByContentId(
    contentId: string
  ) {
    const allQuestionsBank = await QuestionBank.find({ contentId });

    const limit: number = allQuestionsBank.length;

    const shuffledQuestionsBank = this.shuffleArray([...allQuestionsBank]);

    return limit
      ? shuffledQuestionsBank.slice(0, limit)
      : shuffledQuestionsBank;
  }

  // Update question Bank
  static async updateQuestionBank(
    questionId: string,
    updateData: Partial<IQuestionBank>
  ) {
    const { error } = validateUpdateQuestionBank(updateData);
    if (error) throw new BadRequestError(error.details[0].message);

    const questionBankHave = await QuestionBank.findById(questionId);
    if (!questionBankHave) throw new NotFoundError("السؤال غير موجود");

    const questionBank = await QuestionBank.findByIdAndUpdate(
      questionId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!questionBank) throw new NotFoundError("فشل تحديث السؤال");

    return { message: "تم تحديث السؤال بنجاح" };
  }

  // Delete question Bank
  static async deleteQuestionBank(questionId: string) {
    const questionBank = await QuestionBank.findByIdAndDelete(questionId);
    if (!questionBank) throw new NotFoundError("السؤال غير موجود");
    return { message: "تم حذف السؤال بنجاح" };
  }

  // Update question Bank image
  static async updateQuestionBankImage(
    questionId: string,
    file: ICloudinaryFile
  ) {
    if (!file) throw new BadRequestError("صورة السؤال مطلوبة");

    const questionBankHave = await QuestionBank.findById(questionId);
    if (!questionBankHave) throw new NotFoundError("السؤال غير موجود");

    const questionBank = await QuestionBank.findByIdAndUpdate(
      questionId,
      { image: file.path },
      { new: true }
    );

    if (!questionBank) throw new NotFoundError("فشل تحديث صورة السؤال");

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

export { QuestionBankService };

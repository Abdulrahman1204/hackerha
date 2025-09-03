import mongoose from "mongoose";

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
import { RequestBank } from "../../../../models/banks/content/request/RequestBank.model";

class QuestionBankService {
  // Create new question bank
  static async createQuestionBank(
    questionData: IQuestionBank,
    file?: ICloudinaryFile
  ) {
    const { error } = validateCreateQuestionBank(questionData);
    if (error) throw new BadRequestError(error.details[0].message);

    if (
      !mongoose.Types.ObjectId.isValid(
        questionData.contentId as unknown as string
      )
    ) {
      throw new BadRequestError("معرف الامتحان غير صالح");
    }

    // Verify content exists
    const content = await Content.findById(questionData.contentId);
    if (!content) throw new NotFoundError("المحتوى غير موجود");

    const questionBank = await QuestionBank.create(questionData);
    await questionBank.populate("contentId", "title");

    if (!questionBank) throw new NotFoundError("فشل إنشاء السؤال");

    return { message: "تم إنشاء السؤال بنجاح" };
  }

  // Get question Bank by ID
  static async getQuestionBankById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف السؤال غير صالح");
    }

    const questionBank = await QuestionBank.findById(id).populate(
      "contentId",
      "title"
    );
    if (!questionBank) throw new NotFoundError("السؤال غير موجود");

    const requestsBank = await RequestBank.find({ questionBankId: id }).sort({
      createdAt: -1,
    });
    const BankquestionsWithRequest = {
      ...questionBank.toObject(),
      requestsBank,
    };
    return BankquestionsWithRequest;
  }

  // Get questions Bank by exam ID
  static async getQuestionsBankByContentId(contentId: string) {
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      throw new BadRequestError("معرف الامتحان غير صالح");
    }

    const allQuestionsBank = await QuestionBank.find({ contentId });

    const limit: number = allQuestionsBank.length;

    const shuffledQuestionsBank = this.shuffleArray([...allQuestionsBank]);

    return limit
      ? shuffledQuestionsBank.slice(0, limit)
      : shuffledQuestionsBank;
  }

  // Update question Bank
  static async updateQuestionBank(
    id: string,
    questionData: Partial<IQuestionBank>
  ) {
    const { error } = validateUpdateQuestionBank(questionData);
    if (error) throw new BadRequestError(error.details[0].message);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف السؤال غير صالح");
    }

    if (
      questionData.contentId &&
      !mongoose.Types.ObjectId.isValid(
        questionData.contentId as unknown as string
      )
    ) {
      throw new BadRequestError("معرف الامتحان غير صالح");
    }

    if (questionData.contentId) {
      const contentHave = await Content.findById(questionData.contentId);
      if (!contentHave) throw new NotFoundError("المحتوى غير موجود");
    }

    const questionBankHave = await QuestionBank.findById(id);
    if (!questionBankHave) throw new NotFoundError("السؤال غير موجود");

    const updatedQuestionBank = await QuestionBank.findByIdAndUpdate(
      id,
      questionData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedQuestionBank) throw new NotFoundError("فشل تحديث السؤال");

    return { message: "تم تحديث السؤال بنجاح" };
  }

  // Update question Bank image
  static async updateQuestionBankImage(id: string, file: ICloudinaryFile) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف السؤال غير صالح");
    }

    if (!file) throw new BadRequestError("صورة السؤال مطلوبة");

    const questionBankHave = await QuestionBank.findById(id);
    if (!questionBankHave) throw new NotFoundError("السؤال غير موجود");

    const questionBank = await QuestionBank.findByIdAndUpdate(
      id,
      { image: file.path },
      { new: true, runValidators: true }
    );

    if (!questionBank) throw new NotFoundError("فشل تحديث صورة السؤال");

    return { message: "تم تحديث صورة السؤال بنجاح" };
  }

  // Delete question Bank
  static async deleteQuestionBank(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف السؤال غير صالح");
    }

    const questionBank = await QuestionBank.findByIdAndDelete(id);
    if (!questionBank) throw new NotFoundError("السؤال غير موجود");
    return { message: "تم حذف السؤال بنجاح" };
  }

  // Delete questions Bank by exam id
  static async deleteQuestionsBankByExamId(examId: string) {
    if (!mongoose.Types.ObjectId.isValid(examId)) {
      throw new BadRequestError("معرف الامتحان غير صالح");
    }

    const result = await QuestionBank.deleteMany({ examId });

    return {
      message: "تم حذف جميع أسئلة الامتحان بنجاح",
      deletedCount: result.deletedCount,
    };
  }

  // Delete question bank image
  static async deleteQuestionBankImage(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف السؤال غير صالح");
    }

    const questionBank = await QuestionBank.findById(id);
    if (!questionBank) {
      throw new NotFoundError("السؤال غير موجود");
    }

    const questionBankDeleteImage = await QuestionBank.findByIdAndUpdate(
      id,
      { image: "" },
      { new: true, runValidators: true }
    );

    if (!questionBankDeleteImage) {
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

export { QuestionBankService };

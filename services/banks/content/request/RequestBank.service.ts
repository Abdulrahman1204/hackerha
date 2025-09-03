import mongoose from "mongoose";
import {
  BadRequestError,
  NotFoundError,
} from "../../../../middlewares/handleErrors";

import { ICloudinaryFile } from "../../../../utils/types";
import { IRequestBank } from "../../../../models/banks/content/request/dtos";
import {
  RequestBank,
  validateCreateRequestBank,
  validateUpdateRequestBank,
} from "../../../../models/banks/content/request/RequestBank.model";
import { QuestionBank } from "../../../../models/banks/content/question/QuestionBank.model";

class CtrlRequestBankService {
  // ~ Post => /api/univers/ctrl/request-bank ~ Create New RequestBank
  static async createRequestBank(
    requestBankData: IRequestBank,
    file?: ICloudinaryFile
  ) {
    const { error } = validateCreateRequestBank(requestBankData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        requestBankData.questionBankId as unknown as string
      )
    ) {
      throw new BadRequestError("معرف بنك الأسئلة غير صالح");
    }

    // Check if question bank exists
    const questionBankExists = await QuestionBank.findById(
      requestBankData.questionBankId
    );
    if (!questionBankExists) {
      throw new NotFoundError("بنك الأسئلة غير موجود");
    }

    const requestBank = await RequestBank.create({
      ...requestBankData,
      image: file ? file.path : "",
    });
    await requestBank.populate("questionBankId", "title subject");

    if (!requestBank) throw new NotFoundError("فشل إنشاء الطلب");

    return { message: "تم إنشاء الطلب بنجاح", requestBank };
  }

  // ~ Get => /api/univers/ctrl/request-bank/:id ~ Get RequestBank by ID
  static async getRequestBankById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف الطلب غير صالح");
    }

    const requestBank = await RequestBank.findById(id).populate(
      "questionBankId",
      "title subject courseId"
    );
    if (!requestBank) {
      throw new NotFoundError("الطلب غير موجود");
    }

    return requestBank;
  }

  // ~ Get => /api/univers/ctrl/request-bank/question-bank/:questionBankId ~ Get RequestBanks by Question Bank ID
  static async getRequestBanksByQuestionBankId(questionBankId: string) {
    if (!mongoose.Types.ObjectId.isValid(questionBankId)) {
      throw new BadRequestError("معرف بنك الأسئلة غير صالح");
    }

    const requestBanks = await RequestBank.find({ questionBankId }).sort({
      createdAt: -1,
    });

    return requestBanks;
  }

  // ~ Put => /api/univers/ctrl/request-bank/:id ~ Update RequestBank
  static async updateRequestBank(
    requestBankData: Partial<IRequestBank>,
    id: string,
    file?: ICloudinaryFile
  ) {
    const { error } = validateUpdateRequestBank(requestBankData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف الطلب غير صالح");
    }

    if (
      requestBankData.questionBankId &&
      !mongoose.Types.ObjectId.isValid(
        requestBankData.questionBankId as unknown as string
      )
    ) {
      throw new BadRequestError("معرف بنك الأسئلة غير صالح");
    }

    // Check if question bank exists (if provided)
    if (requestBankData.questionBankId) {
      const questionBankExists = await QuestionBank.findById(
        requestBankData.questionBankId
      );
      if (!questionBankExists) {
        throw new NotFoundError("بنك الأسئلة غير موجود");
      }
    }

    const updateData: any = { ...requestBankData };
    if (file) {
      updateData.image = file.path;
    }

    const requestBank = await RequestBank.findById(id);
    if (!requestBank) {
      throw new NotFoundError("الطلب غير موجود");
    }

    const updatedRequestBank = await RequestBank.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedRequestBank) {
      throw new NotFoundError("فشل تحديث الطلب");
    }

    return { message: "تم تحديث الطلب بنجاح" };
  }

  // ~ Put => /api/univers/ctrl/request-bank/:id/image ~ Update RequestBank Image
  static async updateRequestBankImage(id: string, file: ICloudinaryFile) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف الطلب غير صالح");
    }

    if (!file) {
      throw new BadRequestError("صورة الطلب مطلوبة");
    }

    const requestBank = await RequestBank.findById(id);
    if (!requestBank) {
      throw new NotFoundError("الطلب غير موجود");
    }

    const updatedRequestBank = await RequestBank.findByIdAndUpdate(
      id,
      { image: file.path },
      { new: true, runValidators: true }
    );

    if (!updatedRequestBank) {
      throw new NotFoundError("فشل تحديث صورة الطلب");
    }

    return {
      message: "تم تحديث صورة الطلب بنجاح",
    };
  }

  // ~ Delete => /api/univers/ctrl/request-bank/:id ~ Delete RequestBank
  static async deleteRequestBank(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف الطلب غير صالح");
    }

    const deletedRequestBank = await RequestBank.findByIdAndDelete(id);
    if (!deletedRequestBank) {
      throw new NotFoundError("الطلب غير موجود");
    }

    return { message: "تم حذف الطلب بنجاح" };
  }

  // ~ Delete => /api/univers/ctrl/request-bank/question-bank/:questionBankId ~ Delete All RequestBanks for Question Bank
  static async deleteRequestBanksByQuestionBankId(questionBankId: string) {
    if (!mongoose.Types.ObjectId.isValid(questionBankId)) {
      throw new BadRequestError("معرف بنك الأسئلة غير صالح");
    }

    const result = await RequestBank.deleteMany({ questionBankId });

    return {
      message: "تم حذف جميع طلبات بنك الأسئلة بنجاح",
    };
  }

  // ~ Delete => /api/univers/ctrl/request-bank/:id/image ~ Delete RequestBank Image
  static async deleteRequestBankImage(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف الطلب غير صالح");
    }

    const requestBank = await RequestBank.findById(id);
    if (!requestBank) {
      throw new NotFoundError("الطلب غير موجود");
    }

    const requestBankDeleteImage = await RequestBank.findByIdAndUpdate(
      id,
      { image: "" },
      { new: true, runValidators: true }
    );

    if (!requestBankDeleteImage) {
      throw new NotFoundError("فشل حذف صورة الطلب بنجاح");
    }

    return {
      message: "تم حذف صورة الطلب بنجاح",
    };
  }
}

export { CtrlRequestBankService };

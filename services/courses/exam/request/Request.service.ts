import mongoose from "mongoose";
import {
  BadRequestError,
  NotFoundError,
} from "../../../../middlewares/handleErrors";
import { Question } from "../../../../models/courses/exam/question/Question.model";
import { IRequest } from "../../../../models/courses/exam/request/dtos";
import {
  Request,
  validateCreateRequest,
  validateUpdateRequest,
} from "../../../../models/courses/exam/request/Request.model";
import { ICloudinaryFile } from "../../../../utils/types";

class CtrlRequestService {
  // ~ Post => /api/univers/ctrl/request ~ Create New Request
  static async createRequest(requestData: IRequest, file?: ICloudinaryFile) {
    const { error } = validateCreateRequest(requestData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        requestData.questionId as unknown as string
      )
    ) {
      throw new BadRequestError("معرف السؤال غير صالح");
    }

    // Check if question exists
    const questionExists = await Question.findById(requestData.questionId);
    if (!questionExists) {
      throw new NotFoundError("السؤال غير موجود");
    }

    const request = await Request.create({
      ...requestData,
      image: file ? file.path : "",
    });
    await request.populate("questionId", "text");

    if (!request) throw new NotFoundError("فشل إنشاء الطلب");

    return { message: "تم إنشاء الطلب بنجاح" };
  }

  // ~ Get => /api/univers/ctrl/request/:id ~ Get Request by ID
  static async getRequestById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف الطلب غير صالح");
    }

    const request = await Request.findById(id).populate(
      "questionId",
      "text examId"
    );
    if (!request) {
      throw new NotFoundError("الطلب غير موجود");
    }

    return request;
  }

  // ~ Get => /api/univers/ctrl/request/question/:questionId ~ Get Requests by Question ID
  static async getRequestsByQuestionId(
    questionId: string
  ) {
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      throw new BadRequestError("معرف السؤال غير صالح");
    }

    const requests = await Request.find({ questionId }).sort({ createdAt: -1 });

    return requests;
  }

  // ~ Put => /api/univers/ctrl/request/:id ~ Update Request
  static async updateRequest(
    requestData: Partial<IRequest>,
    id: string,
    file?: ICloudinaryFile
  ) {
    const { error } = validateUpdateRequest(requestData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف الطلب غير صالح");
    }

    if (
      requestData.questionId &&
      !mongoose.Types.ObjectId.isValid(
        requestData.questionId as unknown as string
      )
    ) {
      throw new BadRequestError("معرف السؤال غير صالح");
    }

    // Check if question exists (if provided)
    if (requestData.questionId) {
      const questionExists = await Question.findById(requestData.questionId);
      if (!questionExists) {
        throw new NotFoundError("السؤال غير موجود");
      }
    }

    const updateData: any = { ...requestData };
    if (file) {
      updateData.image = file.path;
    }

    const request = await Request.findById(id);
    if (!request) {
      throw new NotFoundError("الطلب غير موجود");
    }

    const updatedRequest = await Request.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedRequest) {
      throw new NotFoundError("فشل تحديث الطلب");
    }

    return { message: "تم تحديث الطلب بنجاح" };
  }

  // ~ Put => /api/univers/ctrl/request/:id/image ~ Update Request Image
  static async updateRequestImage(id: string, file: ICloudinaryFile) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف الطلب غير صالح");
    }

    if (!file) {
      throw new BadRequestError("صورة الطلب مطلوبة");
    }

    const request = await Request.findById(id);
    if (!request) {
      throw new NotFoundError("الطلب غير موجود");
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { image: file.path },
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      throw new NotFoundError("فشل تحديث صورة الطلب");
    }

    return { message: "تم تحديث صورة الطلب بنجاح" };
  }

  // ~ Delete => /api/univers/ctrl/request/:id ~ Delete Request
  static async deleteRequest(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف الطلب غير صالح");
    }

    const deletedRequest = await Request.findByIdAndDelete(id);
    if (!deletedRequest) {
      throw new NotFoundError("الطلب غير موجود");
    }

    return { message: "تم حذف الطلب بنجاح" };
  }

  // ~ Delete => /api/univers/ctrl/request/question/:questionId ~ Delete All Requests for Question
  static async deleteRequestsByQuestionId(questionId: string) {
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      throw new BadRequestError("معرف السؤال غير صالح");
    }

    const result = await Request.deleteMany({ questionId });

    return {
      message: "تم حذف جميع طلبات السؤال بنجاح",
    };
  }

  // ~ Delete => /api/univers/ctrl/request/:id/image ~ Delete Request Image
  static async deleteRequestImage(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("معرف الطلب غير صالح");
    }

    const request = await Request.findById(id);
    if (!request) {
      throw new NotFoundError("الطلب غير موجود");
    }

    const requestDeleteImage = await Request.findByIdAndUpdate(
      id,
      { image: "" },
      { new: true, runValidators: true }
    );

    if (!requestDeleteImage) {
      throw new NotFoundError("فشل حذف صورة الطلب بنجاح ");
    }

    return { message: "تم حذف صورة الطلب بنجاح" };
  }
}

export { CtrlRequestService };

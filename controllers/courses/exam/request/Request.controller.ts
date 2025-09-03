import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { CtrlRequestService } from "../../../../services/courses/exam/request/Request.service";
import { ICloudinaryFile } from "../../../../utils/types";

class CtrlRequestController {
  // ~ Post => /api/univers/ctrl/request ~ Create New Request
  createRequest = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlRequestService.createRequest(
        req.body,
        req.file as ICloudinaryFile
      );

      res.status(201).json(result);
    }
  );

  // ~ Get => /api/univers/ctrl/request/:id ~ Get Request by ID
  getRequestById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlRequestService.getRequestById(req.params.id);
      res.status(200).json(result);
    }
  );

  // ~ Get => /api/univers/ctrl/request/question/:questionId ~ Get Requests by Question ID
  getRequestsByQuestionId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {

      const result = await CtrlRequestService.getRequestsByQuestionId(
        req.params.questionId
      );

      res.status(200).json(result);
    }
  );

  // ~ Put => /api/univers/ctrl/request/:id ~ Update Request
  updateRequest = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlRequestService.updateRequest(
        req.body,
        req.params.id,
        req.file as ICloudinaryFile
      );

      res.status(200).json(result);
    }
  );

  // ~ Put => /api/univers/ctrl/request/:id/image ~ Update Request Image
  updateRequestImage = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlRequestService.updateRequestImage(
        req.params.id,
        req.file as ICloudinaryFile
      );

      res.status(200).json(result);
    }
  );

  // ~ Delete => /api/univers/ctrl/request/:id ~ Delete Request
  deleteRequest = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlRequestService.deleteRequest(req.params.id);
      res.status(200).json(result);
    }
  );

  // ~ Delete => /api/univers/ctrl/request/question/:questionId ~ Delete All Requests for Question
  deleteRequestsByQuestionId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlRequestService.deleteRequestsByQuestionId(
        req.params.questionId
      );
      res.status(200).json(result);
    }
  );

  // ~ Delete => /api/univers/ctrl/request/:id/image ~ Delete Request Image
  deleteRequestImage = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlRequestService.deleteRequestImage(req.params.id);
      res.status(200).json(result);
    }
  );
}

export const ctrlRequestController = new CtrlRequestController();

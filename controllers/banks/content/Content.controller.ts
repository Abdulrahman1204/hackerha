import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthenticatedRequest } from "../../../utils/types";
import { ForbiddenError } from "../../../middlewares/handleErrors";
import { CtrlContentService } from "../../../services/banks/content/Content.service";

class CtrlContentController {
  // ~ Get => /api/hackit/ctrl/content ~ Get All Content
  getAllContents = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlContentService.getAllContents();
      res.status(200).json(result);
    }
  );

  // ~ Get => /api/hackit/ctrl/content/:id ~ Get Single Content
  getSingleContent = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlContentService.getSingleContent(req.params.id);
      res.status(200).json(result);
    }
  );

  // ~ Get => /api/hackit/ctrl/content/bank/:bankId ~ Get Content by Bank ID
  getContentByBankId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlContentService.getContentByBankId(
        req.params.bankId
      );
      res.status(200).json(result);
    }
  );

  // ~ Post => /api/hackit/ctrl/content ~ Create New Content
  createNewContent = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const result = await CtrlContentService.createNewContent(req.body);
      res.status(201).json(result);
    }
  );

  // ~ Put => /api/hackit/ctrl/content/:id ~ Update Content
  updateContent = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const user = (req as AuthenticatedRequest).user;
      const result = await CtrlContentService.updateContent(
        req.body,
        req.params.id
      );
      res.status(200).json(result);
    }
  );

  // ~ Delete => /api/hackit/ctrl/content/:id ~ Delete Content
  deleteContent = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const result = await CtrlContentService.deleteContent(req.params.id);
      res.status(200).json(result);
    }
  );
}

export const ctrlContentController = new CtrlContentController();

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ICloudinaryFile } from "../../../../utils/types";
import { CtrlRequestBankService } from "../../../../services/banks/content/request/RequestBank.service";

class CtrlRequestBankController {
  // ~ Post => /api/univers/ctrl/request-bank ~ Create New RequestBank
  createRequestBank = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlRequestBankService.createRequestBank(
        req.body,
        req.file as ICloudinaryFile
      );

      res.status(201).json(result);
    }
  );

  // ~ Get => /api/univers/ctrl/request-bank/:id ~ Get RequestBank by ID
  getRequestBankById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlRequestBankService.getRequestBankById(req.params.id);
      res.status(200).json(result);
    }
  );

  // ~ Get => /api/univers/ctrl/request-bank/question-bank/:questionBankId ~ Get RequestBanks by Question Bank ID
  getRequestBanksByQuestionBankId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {

      const result = await CtrlRequestBankService.getRequestBanksByQuestionBankId(
        req.params.questionBankId
      );

      res.status(200).json(result);
    }
  );

  // ~ Put => /api/univers/ctrl/request-bank/:id ~ Update RequestBank
  updateRequestBank = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlRequestBankService.updateRequestBank(
        req.body,
        req.params.id,
        req.file as ICloudinaryFile
      );

      res.status(200).json(result);
    }
  );

  // ~ Put => /api/univers/ctrl/request-bank/:id/image ~ Update RequestBank Image
  updateRequestBankImage = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlRequestBankService.updateRequestBankImage(
        req.params.id,
        req.file as ICloudinaryFile
      );

      res.status(200).json(result);
    }
  );

  // ~ Delete => /api/univers/ctrl/request-bank/:id ~ Delete RequestBank
  deleteRequestBank = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlRequestBankService.deleteRequestBank(req.params.id);
      res.status(200).json(result);
    }
  );

  // ~ Delete => /api/univers/ctrl/request-bank/question-bank/:questionBankId ~ Delete All RequestBanks for Question Bank
  deleteRequestBanksByQuestionBankId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlRequestBankService.deleteRequestBanksByQuestionBankId(
        req.params.questionBankId
      );
      res.status(200).json(result);
    }
  );

  // ~ Delete => /api/univers/ctrl/request-bank/:id/image ~ Delete RequestBank Image
  deleteRequestBankImage = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlRequestBankService.deleteRequestBankImage(req.params.id);
      res.status(200).json(result);
    }
  );
}

export const ctrlRequestBankController = new CtrlRequestBankController();
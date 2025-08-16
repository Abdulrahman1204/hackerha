import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { CtrlBanksService } from "../../services/banks/Bank.service";
import { AuthenticatedRequest, ICloudinaryFile } from "../../utils/types";
import {
  BadRequestError,
  ForbiddenError,
} from "../../middlewares/handleErrors";

class CtrlBanksController {
  // ~ Get => /api/hackit/ctrl/banks ~ Get All Banks
  getAllBanks = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { name, year } = req.query;

      // Validate year if provided
      if (year) {
        const yearNum = parseInt(year as string);
        if (isNaN(yearNum)) {
          throw new BadRequestError("السنة الدراسية يجب أن تكون رقماً");
        }
        if (yearNum < 1 || yearNum > 5) {
          throw new BadRequestError("السنة الدراسية يجب أن تكون بين 1 و 5");
        }
      }

      // Prepare filters object
      const filters = {
        name: name as string,
        year: year ? parseInt(year as string) : undefined,
      };

      const result = await CtrlBanksService.getAllBanks(filters);
      res.status(200).json(result);
    }
  );

  // ~ Get => /api/hackit/ctrl/banks/:id ~ Get Single Bank
  getSingleBank = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlBanksService.getSingleBank(req.params.id);
      res.status(200).json(result);
    }
  );

  // ~ Post => /api/hackit/ctrl/banks ~ Create New Bank
  createNewBank = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlBanksService.createNewBank(
        req.body,
        req.file as ICloudinaryFile
      );
      res.status(201).json(result);
    }
  );

  // ~ Put => /api/hackit/ctrl/banks/:id ~ Update Bank
  updateBank = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlBanksService.updateBank(req.body, req.params.id);
      res.status(200).json(result);
    }
  );

  // ~ Delete => /api/hackit/ctrl/banks/:id ~ Delete Bank
  deleteBank = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlBanksService.deleteBank(req.params.id);
      res.status(200).json(result);
    }
  );

  // ~ put => /api/hackit/ctrl/bank/:id/image ~ Update Image Bank
  updateImageBank = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlBanksService.updateImageBank(
        req.params.id,
        req.file as ICloudinaryFile
      );

      res.status(200).json(result);
    }
  );
}

export const ctrlBanksController = new CtrlBanksController();

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { CtrlResultService } from "../../services/result/Result.service";
import { AuthenticatedRequest } from "../../utils/types";

class CtrlResultController {
  // ~ Get => /api/univers/ctrl/result ~ Get All Results
  getAllResults = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const studentId = req.query.studentId as string;
      const minTotal = req.query.minTotal
        ? Number(req.query.minTotal)
        : undefined;
      const maxTotal = req.query.maxTotal
        ? Number(req.query.maxTotal)
        : undefined;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await CtrlResultService.getAllResults(
        studentId,
        minTotal,
        maxTotal,
        page,
        limit
      );

      res.status(200).json(result);
    }
  );

  // ~ Get => /api/univers/ctrl/result/:id ~ Get Result by ID
  getResultById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlResultService.getResultById(req.params.id);
      res.status(200).json(result);
    }
  );

  // ~ Get => /api/univers/ctrl/result/student/:studentId ~ Get Results by Student ID
  getResultsByStudent = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await CtrlResultService.getResultsByStudent(
        req.params.studentId,
        page,
        limit
      );

      res.status(200).json(result);
    }
  );

  // ~ Post => /api/univers/ctrl/result ~ Create New Result
  createResult = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlResultService.createResult(req.body);
      res.status(201).json(result);
    }
  );

  // ~ Put => /api/univers/ctrl/result/:id ~ Update Result
  updateResult = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlResultService.updateResult(
        req.body,
        req.params.id
      );
      res.status(200).json(result);
    }
  );

  // ~ Delete => /api/univers/ctrl/result/:id ~ Delete Result
  deleteResult = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlResultService.deleteResult(req.params.id);
      res.status(200).json(result);
    }
  );
}

export const ctrlResultController = new CtrlResultController();

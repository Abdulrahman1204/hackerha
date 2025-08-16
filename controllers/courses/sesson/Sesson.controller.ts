import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthenticatedRequest, ICloudinaryFile } from "../../../utils/types";
import { CtrlSessonService } from "../../../services/courses/sesson/Sesson.service";
import { ForbiddenError } from "../../../middlewares/handleErrors";

class CtrlSessonController {
  // ~ POST /api/sessons - Create sesson
  createSesson = asyncHandler(async (req: Request, res: Response) => {
    const result = await CtrlSessonService.createSesson(req.body);
    res.status(201).json(result);
  });

  // ~ GET /api/sessons/:id - Get sesson by ID
  getSessonById = asyncHandler(async (req: Request, res: Response) => {
    const sesson = await CtrlSessonService.getSessonById(req.params.id);
    res.status(200).json(sesson);
  });

  // ~ GET /api/courses/:courseId/sessons - Get sessons by course ID
  getSessonsByCourseId = asyncHandler(async (req: Request, res: Response) => {
    const sessons = await CtrlSessonService.getSessonsByCourseId(
      req.params.courseId
    );
    res.status(200).json(sessons);
  });

  // ~ PUT /api/sessons/:id - Update sesson
  updateSesson = asyncHandler(async (req: Request, res: Response) => {
    const result = await CtrlSessonService.updateSesson(
      req.params.id,
      req.body
    );
    res.status(200).json(result);
  });

  // ~ DELETE /api/sessons/:id - Delete sesson
  deleteSesson = asyncHandler(async (req: Request, res: Response) => {
    const result = await CtrlSessonService.deleteSesson(req.params.id);
    res.status(200).json(result);
  });

  // ~ PUT /api/sessons/:id/like - Like sesson
  likeSesson = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const user = (req as AuthenticatedRequest).user;
      if (!user?.id) {
        throw new ForbiddenError("Error: no token");
      }

      const result = await CtrlSessonService.likeSesson(req.params.id, user.id);
      res.status(200).json(result);
    }
  );

  // ~ PUT /api/sessons/:id/dislike - Dislike sesson
  dislikeSesson = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const user = (req as AuthenticatedRequest).user;
      if (!user?.id) {
        throw new ForbiddenError("Error: no token");
      }

      const result = await CtrlSessonService.dislikeSesson(
        req.params.id,
        user.id
      );
      res.status(200).json(result);
    }
  );
}

export const ctrlSessonController = new CtrlSessonController();

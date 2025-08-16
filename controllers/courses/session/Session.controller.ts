import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthenticatedRequest, ICloudinaryFile } from "../../../utils/types";
import { CtrlSessionService } from "../../../services/courses/session/Session.service";
import { ForbiddenError } from "../../../middlewares/handleErrors";

class CtrlSessionController {
  // ~ POST /api/sessions - Create sessions.
  createSession = asyncHandler(async (req: Request, res: Response) => {
    const result = await CtrlSessionService.createSession(req.body);
    res.status(201).json(result);
  });

  // ~ GET /api/sessions/:id - Get sessions by ID
  getSessionById = asyncHandler(async (req: Request, res: Response) => {
    const sesson = await CtrlSessionService.getSessionById(req.params.id);
    res.status(200).json(sesson);
  });

  // ~ GET /api/courses/:courseId/sessions - Get sessions by course ID
  getSessionsByCourseId = asyncHandler(async (req: Request, res: Response) => {
    const sessons = await CtrlSessionService.getSessionsByCourseId(
      req.params.courseId
    );
    res.status(200).json(sessons);
  });

  // ~ PUT /api/sessions/:id - Update sessions
  updateSession = asyncHandler(async (req: Request, res: Response) => {
    const result = await CtrlSessionService.updateSession(
      req.params.id,
      req.body
    );
    res.status(200).json(result);
  });

  // ~ DELETE /api/sessions/:id - Delete sessions
  deleteSession = asyncHandler(async (req: Request, res: Response) => {
    const result = await CtrlSessionService.deleteSession(req.params.id);
    res.status(200).json(result);
  });

  // ~ PUT /api/sessions/:id/like - Like sessions
  likeSession = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;
    if (!user?.id) {
      throw new ForbiddenError("Error: no token");
    }

    const result = await CtrlSessionService.likeSession(req.params.id, user.id);
    res.status(200).json(result);
  });

  // ~ PUT /api/sessions/:id/dislike - Dislike sessions
  dislikeSession = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;
    if (!user?.id) {
      throw new ForbiddenError("Error: no token");
    }

    const result = await CtrlSessionService.dislikeSession(
      req.params.id,
      user.id
    );
    res.status(200).json(result);
  });
}

export const ctrlSessionController = new CtrlSessionController();

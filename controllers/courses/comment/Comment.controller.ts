import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthenticatedRequest } from "../../../utils/types";
import { CommentService } from "../../../services/courses/comment/Comment.service";
import { ForbiddenError } from "../../../middlewares/handleErrors";

class CommentController {
  createComment = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const user = (req as AuthenticatedRequest).user;
      if (!user?.id) {
        throw new ForbiddenError("Error: no token");
      }

      const result = await CommentService.createComment({
        ...req.body,
        studentId: user.id,
      });
      res.status(201).json(result);
    }
  );

  getCourseComments = asyncHandler(async (req: Request, res: Response) => {
    const comments = await CommentService.getCourseComments(
      req.params.courseId
    );
    res.status(200).json(comments);
  });

  updateComment = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const user = (req as AuthenticatedRequest).user;
      if (user?.id !== req.params.studentId && user?.role !== "admin") {
        throw new ForbiddenError("Not Allowed");
      }

      const result = await CommentService.updateComment(
        req.params.id,
        user.id,
        req.body
      );
      res.status(200).json(result);
    }
  );

  deleteComment = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const user = (req as AuthenticatedRequest).user;
      if (user?.id !== req.params.studentId && user?.role !== "admin") {
        throw new ForbiddenError("Not Allowed");
      }

      const result = await CommentService.deleteComment(req.params.id, user.id);
      res.status(200).json(result);
    }
  );
}

export const commentController = new CommentController();

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthenticatedRequest } from "../../../utils/types";
import { ExamService } from "../../../services/courses/exam/Exam.service";

class ExamController {
  // Create exam
  createExam = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const result = await ExamService.createExam(req.body);
      res.status(201).json(result);
    }
  );

  // Get exam by ID
  getExamById = asyncHandler(async (req: Request, res: Response) => {
    const exam = await ExamService.getExamById(req.params.id);
    res.status(200).json(exam);
  });

  // Get exams by course ID
  getExamsByCourseId = asyncHandler(async (req: Request, res: Response) => {
    const exams = await ExamService.getExamsByCourseId(req.params.courseId);
    res.status(200).json(exams);
  });

  // Update exam
  updateExam = asyncHandler(async (req: Request, res: Response) => {
    const result = await ExamService.updateExam(req.params.id, req.body);
    res.status(200).json(result);
  });

  // Delete exam
  deleteExam = asyncHandler(async (req: Request, res: Response) => {
    const result = await ExamService.deleteExam(req.params.id);
    res.status(200).json(result);
  });
}

export const examController = new ExamController();

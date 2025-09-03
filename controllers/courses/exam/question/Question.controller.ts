import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { QuestionService } from "../../../../services/courses/exam/question/Question.service";
import { ICloudinaryFile } from "../../../../utils/types";

class CtrlQuestionController {
  // Create new question
  createQuestion = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await QuestionService.createQuestion(
        req.body,
        req.file as ICloudinaryFile
      );

      res.status(201).json(result);
    }
  );

  // Get question by ID
  getQuestionById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await QuestionService.getQuestionById(req.params.id);
      res.status(200).json(result);
    }
  );

  // Get questions Bank by exam ID
  getQuestionsByExamId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const questions = await QuestionService.getQuestionsByExamId(
        req.params.examId
      );

      res.status(200).json(questions);
    }
  );

  // Update question Bank
  updateQuestion = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await QuestionService.updateQuestion(
        req.body,
        req.params.id
      );

      res.status(200).json(result);
    }
  );

  // Update question image
  updateQuestionImage = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await QuestionService.updateQuestionImage(
        req.params.id,
        req.file as ICloudinaryFile
      );

      res.status(200).json(result);
    }
  );

  // Delete question
  deleteQuestion = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await QuestionService.deleteQuestion(req.params.id);
      res.status(200).json(result);
    }
  );

  // Delete questions by exam id
  deleteQuestionsByExamId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await QuestionService.deleteQuestionsByExamId(
        req.params.examId
      );
      res.status(200).json(result);
    }
  );

  // Delete question bank image
  deleteQuestionImage = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await QuestionService.deleteQuestionImage(req.params.id);
      res.status(200).json(result);
    }
  );
}

export const ctrlQuestionController = new CtrlQuestionController();

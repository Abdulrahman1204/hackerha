import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { QuestionService } from "../../../../services/courses/exam/question/Question.service";
import { ICloudinaryFile } from "../../../../utils/types";


class QuestionController {
  // Create question
  createQuestion = asyncHandler(
    async (req: Request, res: Response) => {
      const result = await QuestionService.createQuestion(req.body);
      res.status(201).json(result);
    }
  );

  // Get question by ID
  getQuestionById = asyncHandler(async (req: Request, res: Response) => {
    const question = await QuestionService.getQuestionById(req.params.id);
    res.status(200).json(question);
  });

  // Get questions by exam ID
  getQuestionsByExamId = asyncHandler(async (req: Request, res: Response) => {
    const questions = await QuestionService.getQuestionsByExamId(
      req.params.examId
    );
    res.status(200).json(questions);
  });

  // Update question
  updateQuestion = asyncHandler(async (req: Request, res: Response) => {
    const result = await QuestionService.updateQuestion(
      req.params.id,
      req.body
    );
    res.status(200).json(result);
  });

  // Delete question
  deleteQuestion = asyncHandler(async (req: Request, res: Response) => {
    const result = await QuestionService.deleteQuestion(req.params.id);
    res.status(200).json(result);
  });

  // Update question image
  updateQuestionImage = asyncHandler(
    async (req: Request, res: Response) => {
      const result = await QuestionService.updateQuestionImage(
        req.params.id,
        req.file as ICloudinaryFile
      );
      res.status(200).json(result);
    }
  );
}

export const questionController = new QuestionController();

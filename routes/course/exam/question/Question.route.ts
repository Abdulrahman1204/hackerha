import { Router } from "express";
import { questionController } from "../../../../controllers/courses/exam/question/Question.controller";
import upload from "../../../../middlewares/cloudinary";

const router: Router = Router();

// POST /api/questions - Create question (Admin/Teacher)
router.route("/").post(questionController.createQuestion);

// GET /api/questions/:id - Get question by ID (Public)
router.route("/:id").get(questionController.getQuestionById);

// GET /api/questions/exam/:examId - Get questions by exam ID (Public)
router.route("/exam/:examId").get(questionController.getQuestionsByExamId);

// PUT /api/questions/:id - Update question (Admin/Teacher)
router.route("/:id").put(questionController.updateQuestion);

// DELETE /api/questions/:id - Delete question (Admin/Teacher)
router.route("/:id").delete(questionController.deleteQuestion);

// PUT /api/questions/:id/image - Update question image (Admin/Teacher)
router.route("/:id/image").put(upload, questionController.updateQuestionImage);

export default router;

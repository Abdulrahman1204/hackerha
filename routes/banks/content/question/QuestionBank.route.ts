import { Router } from "express";
import upload from "../../../../middlewares/cloudinary";
import { questionBankController } from "../../../../controllers/banks/content/question/QuestionBank.controller";

const router: Router = Router();

// POST /api/questionsbank - Create question Bank (Admin/Teacher)
router.route("/").post(questionBankController.createQuestionBank);

// GET /api/questionsbank/:id - Get question by ID (Public)
router.route("/:id").get(questionBankController.getQuestionBankById);

// GET /api/questionsbank/content/:contentId - Get questions by content ID (Public)
router
  .route("/content/:contentId")
  .get(questionBankController.getQuestionsBankByContentId);

// PUT /api/questionsbank/:id - Update question (Admin/Teacher)
router.route("/:id").put(questionBankController.updateQuestionBank);

// DELETE /api/questionsbank/:id - Delete question (Admin/Teacher)
router.route("/:id").delete(questionBankController.deleteQuestionBank);

// PUT /api/questionsbank/:id/image - Update question image (Admin/Teacher)
router
  .route("/:id/image")
  .put(upload, questionBankController.updateQuestionBankImage);

export default router;

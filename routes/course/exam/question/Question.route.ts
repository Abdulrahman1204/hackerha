import { Router } from "express";
import { ctrlQuestionController } from "../../../../controllers/courses/exam/question/Question.controller";
import upload from "../../../../middlewares/cloudinary";
import verifyToken from "../../../../middlewares/verifyToken";

const router: Router = Router();

router.route("/").post(upload, ctrlQuestionController.createQuestion);

router.route("/:id").get(verifyToken, ctrlQuestionController.getQuestionById);

router
  .route("/exam/:examId")
  .get(verifyToken, ctrlQuestionController.getQuestionsByExamId);

router.route("/:id").put(upload, ctrlQuestionController.updateQuestion);

router
  .route("/:id/image")
  .put(upload, ctrlQuestionController.updateQuestionImage);

router.route("/:id").delete(ctrlQuestionController.deleteQuestion);

router
  .route("/exam/:examId")
  .delete(ctrlQuestionController.deleteQuestionsByExamId);

router.route("/:id/image").delete(ctrlQuestionController.deleteQuestionImage);

export default router;
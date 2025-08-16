import { Router } from "express";
import verifyToken from "../../../middlewares/verifyToken";
import checkRole from "../../../middlewares/checkRole";
import { examController } from "../../../controllers/courses/exam/Exam.controller";

const router: Router = Router();

// POST /api/exams - Create exam (Admin/Teacher)
router.route("/").post(examController.createExam);

// GET /api/exams/:id - Get exam by ID (Public)
router.route("/:id").get(verifyToken, examController.getExamById);

// GET /api/exams/course/:courseId - Get exams by course ID (Public)
router
  .route("/course/:courseId")
  .get(verifyToken, examController.getExamsByCourseId);

// PUT /api/exams/:id - Update exam (Admin/Teacher)
router.route("/:id").put(examController.updateExam);

// DELETE /api/exams/:id - Delete exam (Admin/Teacher)
router.route("/:id").delete(examController.deleteExam);

export default router;

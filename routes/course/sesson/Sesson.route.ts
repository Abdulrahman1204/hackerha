import { Router } from "express";
import verifyToken from "../../../middlewares/verifyToken";
import checkRole from "../../../middlewares/checkRole";
import upload from "../../../middlewares/cloudinary";
import { ctrlSessonController } from "../../../controllers/courses/sesson/Sesson.controller";

const router: Router = Router();

// ~ POST /api/sessons - Create sesson (Admin/Teacher)
router.route("/").post(ctrlSessonController.createSesson);

// ~ GET /api/sessons/:id - Get sesson by ID (Public)
router.route("/:id").get(verifyToken, ctrlSessonController.getSessonById);

// ~ GET /api/courses/:courseId/sessons - Get sessons by course ID (Public)
router
  .route("/courses/:courseId/sessons")
  .get(verifyToken, ctrlSessonController.getSessonsByCourseId);

// ~ PUT /api/sessons/:id - Update sesson (Admin/Teacher)
router.route("/:id").put(ctrlSessonController.updateSesson);

// ~ DELETE /api/sessons/:id - Delete sesson (Admin/Teacher)
router.route("/:id").delete(ctrlSessonController.deleteSesson);

// ~ PUT /api/sessons/:id/like - Like sesson (Student)
router
  .route("/:id/like")
  .put(verifyToken, checkRole(["student"]), ctrlSessonController.likeSesson);

// ~ PUT /api/sessons/:id/dislike - Dislike sesson (Student)
router
  .route("/:id/dislike")
  .put(verifyToken, checkRole(["student"]), ctrlSessonController.dislikeSesson);

export default router;

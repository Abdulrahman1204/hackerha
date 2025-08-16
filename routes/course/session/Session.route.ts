import { Router } from "express";
import verifyToken from "../../../middlewares/verifyToken";
import checkRole from "../../../middlewares/checkRole";
import { ctrlSessionController } from "../../../controllers/courses/session/Session.controller";

const router: Router = Router();

// ~ POST /api/sessions - Create session (Admin/Teacher)
router.route("/").post(ctrlSessionController.createSession);

// ~ GET /api/sessions/:id - Get session by ID (Public)
router.route("/:id").get(verifyToken, ctrlSessionController.getSessionById);

// ~ GET /api/courses/:courseId/sessions - Get session by course ID (Public)
router
  .route("/courses/:courseId")
  .get(verifyToken, ctrlSessionController.getSessionsByCourseId);

// ~ PUT /api/sessions/:id - Update session (Admin/Teacher)
router.route("/:id").put(ctrlSessionController.updateSession);

// ~ DELETE /api/sessons/:id - Delete sesson (Admin/Teacher)
router.route("/:id").delete(ctrlSessionController.deleteSession);

// ~ PUT /api/sessons/:id/like - Like sesson (Student)
router
  .route("/:id/like")
  .put(verifyToken, checkRole(["student"]), ctrlSessionController.likeSession);

// ~ PUT /api/sessons/:id/dislike - Dislike sesson (Student)
router
  .route("/:id/dislike")
  .put(
    verifyToken,
    checkRole(["student"]),
    ctrlSessionController.dislikeSession
  );

export default router;

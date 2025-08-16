import { Router } from "express";
import verifyToken from "../../../middlewares/verifyToken";
import checkRole from "../../../middlewares/checkRole";
import { commentController } from "../../../controllers/courses/comment/Comment.controller";

const router: Router = Router();

// POST /api/comment - Create comment (Student)
router
  .route("/")
  .post(verifyToken, checkRole(["student"]), commentController.createComment);

// GET /api/comment/course/:courseId - Get course comments (Public)
router
  .route("/course/:courseId")
  .get(verifyToken, commentController.getCourseComments);

// PUT /api/comment/:id - Update comment (Owner)
router
  .route("/:id")
  .put(verifyToken, checkRole(["student"]), commentController.updateComment);

// DELETE /api/comment/:id - Delete comment (Owner or Admin)
router
  .route("/:id/:studentId")
  .delete(
    verifyToken,
    checkRole(["student", "admin"]),
    commentController.deleteComment
  );

export default router;

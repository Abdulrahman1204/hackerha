import { Router } from "express";
import verifyToken from "../../middlewares/verifyToken";
import checkRole from "../../middlewares/checkRole";
import upload from "../../middlewares/cloudinary";
import { ctrlCourseController } from "../../controllers/courses/Course.controller";

const router: Router = Router();

// ~ POST /api/hackit/ctrl/course - Create course (Admin only)
router.route("/").post(upload, ctrlCourseController.createCourse);

// ~ GET /api/hackit/ctrl/course - Get all courses (Public)
router.route("/").get(verifyToken, ctrlCourseController.getAllCourses);

// ~ GET /api/hackit/ctrl/course/:id - Get course by ID (Public)
router.route("/:id").get(verifyToken, ctrlCourseController.getCourseById);

// ~ PUT /api/hackit/ctrl/course/:id - Update course (Admin/Teacher)
router.route("/:id").put(ctrlCourseController.updateCourse);

// ~ DELETE /api/hackit/ctrl/course/:id - Delete course (Admin only)
router.route("/:id").delete(ctrlCourseController.deleteCourse);

// ~ PUT /api/hackit/ctrl/course/imagecourse/:id/ - Update course image (Admin/Teacher)
router
  .route("/imagecourse/:id")
  .put(upload, ctrlCourseController.updateCourseImage);

export default router;

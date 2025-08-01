import { Router } from "express";
import AuthStudentController from "../../../controllers/users/students/Auth.controller";

const router: Router = Router();

// ~ Post => /api/hackit/ctrl/student ~ Create New Student
router.route("/register").post(AuthStudentController.createNewStudentCtrl);

// ~ Post => /api/hackit/ctrl/student/verifyotp/:id ~ verifyOtp
router.route("/verifyotp/:id").post(AuthStudentController.verifyOtpCtrl);

// ~ Post => /api/hackit/ctrl/student/login ~ Login Student
router.route("login").post(AuthStudentController.loginStudent);

export default router;

import { Router } from "express";
import { authStudentController } from "../../../controllers/users/students/Auth.controller";

const router: Router = Router();

// ~ Post => /api/hackit/ctrl/student/register ~ Create New Student
router.route("/register").post(authStudentController.createNewStudentCtrl);

// ~ Post => /api/hackit/ctrl/student/verifyotp/:id ~ verifyOtp
router.route("/verifyotp/:id").post(authStudentController.verifyOtpCtrl);

// ~ Post => /api/hackit/ctrl/student/login ~ Login Student
router.route("login").post(authStudentController.loginStudent);

export default router;

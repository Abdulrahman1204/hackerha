import { Router } from "express";
import { ctrlStudentController } from "../../../controllers/users/students/Student.controller";

const router: Router = Router();

// ~ Post => /api/hackit/ctrl/student/sendemailpassword ~ Send Email For Password For Student
router
  .route("/sendemailpassword")
  .post(ctrlStudentController.sendEmailForPasswordStudent);

// ~ Post => /api/hackit/ctrl/student/forgetPass/:id ~ Forget Password For Student
router
  .route("/forgetPass/:id")
  .post(ctrlStudentController.forgetPasswordStudent);

// ~ Post => /api/hackit/ctrl/student/changepass/:id ~ Change Password For Student
router
  .route("/changepass/:id")
  .post(ctrlStudentController.ChagePasswordStudent);

export default router;

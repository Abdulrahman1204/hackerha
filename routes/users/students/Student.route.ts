import { Router } from "express";
import { ctrlStudentController } from "../../../controllers/users/students/Student.controller";
import verifyToken from "../../../middlewares/verifyToken";
import checkRole from "../../../middlewares/checkRole";
import upload from "../../../middlewares/cloudinary";

const router: Router = Router();

// ~ Get => /api/hackit/ctrl/student/accountprofilestudent/:id ~ Get Profile Student

router
  .route("/accountprofilestudent/:id")
  .get(
    verifyToken,
    checkRole(["student"]),
    ctrlStudentController.getProfileStudent
  );
// ~ Post => /api/hackit/ctrl/student/sendemailpassword ~ Send Email For Password For Student
router
  .route("/sendemailpassword")
  .post(ctrlStudentController.sendEmailForPasswordStudent);

// ~ Post => /api/hackit/ctrl/student/forgetPass/:id ~ Forget Password For Student
router
  .route("/forgetPass/:id")
  .post(ctrlStudentController.forgetPasswordStudent);

// ~ Post => /api/hackit/ctrl/student/changepass/:id ~ Change Password For Student
router.route("/changepass/:id").put(ctrlStudentController.ChagePasswordStudent);

// ~ Put => /api/hackit/ctrl/student/updatedetailsprofile/:id ~ Change details of student
router
  .route("/updatedetailsprofile/:id")
  .put(
    verifyToken,
    checkRole(["student"]),
    ctrlStudentController.UpdateProfileStudent
  );

// ~ Put => /api/hackit/ctrl/student/UpdateProfileImpStudentAdmin/:id ~ Change important details of student
router
  .route("/updateprofileimpstudentadmin/:id")
  .put(
    verifyToken,
    checkRole(["admin", "helper"]),
    ctrlStudentController.UpdateProfileImpStudentAdmin
  );

// ~ Put => /api/hackit/ctrl/student/UpdateProfileSuspendedStudent/:id ~ Change Suspended of student
router
  .route("/UpdateProfileSuspendedStudent/:id")
  .put(
    verifyToken,
    checkRole(["admin", "helper"]),
    ctrlStudentController.UpdateProfileSuspendedStudent
  );

// ~ Put => /api/hackit/ctrl/student/updateimageprofile/:id ~ Change Image of student
router
  .route("/updateimageprofile/:id")
  .put(
    verifyToken,
    checkRole(["student"]),
    upload,
    ctrlStudentController.UpdateImageProfileStudent
  );

// ~ Delete => /api/hackit/ctrl/student/account/:id ~ Delete Student Account
router
  .route("/account/:id")
  .delete(
    verifyToken,
    checkRole(["student", "admin", "helper"]),
    ctrlStudentController.DeleteStudentAccount
  );

export default router;

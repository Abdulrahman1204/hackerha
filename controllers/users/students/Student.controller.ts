import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { CtrlStudentService } from "../../../services/users/students/Student.service";
import { AuthenticatedRequest } from "../../../utils/types";
import { NotFoundError } from "../../../middlewares/handleErrors";

class CtrlStudentController {
  // ~ Post => /api/hackit/ctrl/student/sendemailpassword ~ Send Email For Password For Student
  sendEmailForPasswordStudent = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await CtrlStudentService.SendEmailForPasswordStudent(
        req.body
      );
      res.status(200).json({ message: result.message, id: result.id });
    }
  );

  // ~ Post => /api/hackit/ctrl/student/forgetPass/:id ~ Forget Password For Student
  forgetPasswordStudent = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const result = await CtrlStudentService.ForgetPasswordStudent(
        req.body,
        req.params.id
      );
      res.status(200).json({ message: result.message });
    }
  );

  // ~ Post => /api/hackit/ctrl/student/changepass/:id ~ Change Password For Student
  ChagePasswordStudent = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const result = await CtrlStudentService.ChagePasswordStudent(
        req.body,
        req.params.id
      );
      res.status(200).json({ message: result.message });
    }
  );
}

export const ctrlStudentController = new CtrlStudentController();

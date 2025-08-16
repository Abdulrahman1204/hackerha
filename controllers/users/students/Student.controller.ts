import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { CtrlStudentService } from "../../../services/users/students/Student.service";
import { AuthenticatedRequest, ICloudinaryFile } from "../../../utils/types";
import {
  ForbiddenError,
  NotFoundError,
} from "../../../middlewares/handleErrors";

class CtrlStudentController {
  // ~ Get => /api/hackit/ctrl/student/accountprofilestudent/:id ~ Get Profile Student
  getProfileStudent = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const user = (req as AuthenticatedRequest).user;
      const targetUserId = req.params.id;

      if (user?.id !== targetUserId) {
        throw new ForbiddenError("غير مصرح لك بتعديل هذا الملف الشخصي");
      }
      
      const result = await CtrlStudentService.getProfileStudent(targetUserId);

      res.status(200).json(result);
    }
  );

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

  // ~ Put => /api/hackit/ctrl/student/updatedetailsprofile/:id ~ Change details of student
  UpdateProfileStudent = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const user = (req as AuthenticatedRequest).user;
      const targetUserId = req.params.id;

      if (user?.id !== targetUserId) {
        throw new ForbiddenError("غير مصرح لك بتعديل هذا الملف الشخصي");
      }

      const result = await CtrlStudentService.UpdateProfileStudent(
        req.body,
        targetUserId
      );

      res.status(200).json({ message: result.message });
    }
  );

  // ~ Put => /api/hackit/ctrl/student/UpdateProfileSuspendedStudent/:id ~ Change Suspended of student
  UpdateProfileSuspendedStudent = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const targetUserId = req.params.id;

      const result = await CtrlStudentService.UpdateProfileSuspendedStudent(
        req.body,
        targetUserId
      );

      res.status(200).json({ message: result.message });
    }
  );

  // ~ Put => /api/hackit/ctrl/student/UpdateProfileImpStudentAdmin/:id ~ Change important details of student
  UpdateProfileImpStudentAdmin = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const targetUserId = req.params.id;

      const result = await CtrlStudentService.UpdateProfileImpStudentAdmin(
        req.body,
        targetUserId
      );

      res.status(200).json({ message: result.message });
    }
  );

  // ~ Put => /api/hackit/ctrl/student/updateimageprofile/:id ~ Change Image of student
  UpdateImageProfileStudent = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const user = (req as AuthenticatedRequest).user;
      const targetUserId = req.params.id;

      if (user?.id !== targetUserId) {
        throw new ForbiddenError("غير مصرح لك بتعديل هذا الملف الشخصي");
      }

      const result = await CtrlStudentService.UpdateImageProfileStudent(
        req.file as ICloudinaryFile,
        targetUserId
      );

      res.status(200).json({ message: result.message });
    }
  );

  // ~ Delete => /api/hackit/ctrl/student/account/:id ~ Delete Student Account
  DeleteStudentAccount = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const user = (req as AuthenticatedRequest).user;
      const targetUserId = req.params.id;

      if (user?.id !== targetUserId) {
        throw new ForbiddenError("غير مصرح لك بحذف الحساب");
      }

      const result = await CtrlStudentService.DeleteStudentAccount(
        targetUserId
      );

      res.status(200).json({ message: result.message });
    }
  );
}

export const ctrlStudentController = new CtrlStudentController();

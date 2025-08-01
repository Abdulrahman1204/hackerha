import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthStudentService } from "../../../services/users/students/Auth.service";

class AuthStudentController {
  // ~ Post => /api/hackit/ctrl/student/register ~ Create New Student
  createNewStudentCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await AuthStudentService.createNewStudent(req.body);

      res.status(201).json(result);
    }
  );

  // ~ Post => /api/hackit/ctrl/student/verifyotp/:id ~ verifyOtp
  verifyOtpCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = (await AuthStudentService.verifyOtp(
        req.body,
        req.params.id
      )) as { message: string; token: string };

      res.cookie("tokenHackit", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 30 * 1000,
      });

      res.status(200).json({ message: result.message });
    }
  );

  // ~ Post => /api/hackit/ctrl/student/login ~ Login Student
  loginStudent = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = (await AuthStudentService.loginStudent(req.body)) as {
        message: string;
        token: string;
      };

      res.cookie("tokenHackit", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 30 * 1000,
      });

      res.status(200).json({ message: result.message });
    }
  );
}

export default new AuthStudentController();

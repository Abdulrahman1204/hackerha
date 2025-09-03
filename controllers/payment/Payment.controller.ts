import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { PaymentService } from "../../services/payment/Payment.service";
import { AuthenticatedRequest } from "../../utils/types";

class PaymentController {
  // ~ POST /api/payment/code ~ Generate payment code
  generatePaymentCode = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await PaymentService.generatePaymentCode(req.body);
      res.status(201).json(result);
    }
  );

  // ~ POST /api/payment/verify ~ Verify and use payment code
  verifyPaymentCode = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const user = (req as AuthenticatedRequest).user;

      const result = await PaymentService.verifyPaymentCode({
        ...req.body,
        studentId: user?.id // Adjust based on your auth
      });
      res.status(200).json(result);
    }
  );

  // ~ GET /api/payment/codes/:universityNumber ~ Get payment codes
  getStudentPaymentCodes = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const universityNumber = parseInt(req.params.universityNumber);
      const result = await PaymentService.getStudentPaymentCodes(universityNumber);
      res.status(200).json(result);
    }
  );

  // ~ GET /api/payment/enrollments/:studentId ~ Get enrollments
  getStudentEnrollments = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await PaymentService.getStudentEnrollments(req.params.studentId);
      res.status(200).json(result);
    }
  );
}

export const paymentController = new PaymentController();
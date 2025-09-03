import { Router } from "express";
import { paymentController } from "../../controllers/payment/Payment.controller";
import verifyToken from "../../middlewares/verifyToken";

const router: Router = Router();

// ~ POST /api/payment/code ~ Generate payment code (Admin/University)
router.route("/code").post(paymentController.generatePaymentCode);

// ~ POST /api/payment/verify ~ Verify payment code (Student)
router.route("/verify").post(verifyToken, paymentController.verifyPaymentCode);

// ~ GET /api/payment/codes/:universityNumber ~ Get payment codes
router.route("/codes/:universityNumber").get(paymentController.getStudentPaymentCodes);

// ~ GET /api/payment/enrollments/:studentId ~ Get enrollments
router.route("/enrollments/:studentId").get(paymentController.getStudentEnrollments);

export default router;
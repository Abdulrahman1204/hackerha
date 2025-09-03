import { Router } from "express";
import upload from "../../../../middlewares/cloudinary";
import { ctrlRequestBankController } from "../../../../controllers/banks/content/request/RequestBank.controller";
import verifyToken from "../../../../middlewares/verifyToken";

const router: Router = Router();

// ~ Post => /api/univers/ctrl/request-bank ~ Create New RequestBank
router.route("/").post(upload, ctrlRequestBankController.createRequestBank);

// ~ Get => /api/univers/ctrl/request-bank/:id ~ Get RequestBank by ID
router.route("/:id").get(verifyToken, ctrlRequestBankController.getRequestBankById);

// ~ Get => /api/univers/ctrl/request-bank/question-bank/:questionBankId ~ Get RequestBanks by Question Bank ID
router
  .route("/question-bank/:questionBankId")
  .get(verifyToken, ctrlRequestBankController.getRequestBanksByQuestionBankId);

// ~ Put => /api/univers/ctrl/request-bank/:id ~ Update RequestBank
router.route("/:id").put(upload, ctrlRequestBankController.updateRequestBank);

// ~ Put => /api/univers/ctrl/request-bank/:id/image ~ Update RequestBank Image
router
  .route("/:id/image")
  .put(upload, ctrlRequestBankController.updateRequestBankImage);

// ~ Delete => /api/univers/ctrl/request-bank/:id ~ Delete RequestBank
router.route("/:id").delete(ctrlRequestBankController.deleteRequestBank);

// ~ Delete => /api/univers/ctrl/request-bank/question-bank/:questionBankId ~ Delete All RequestBanks for Question Bank
router
  .route("/question-bank/:questionBankId")
  .delete(ctrlRequestBankController.deleteRequestBanksByQuestionBankId);

// ~ Delete => /api/univers/ctrl/request-bank/:id/image ~ Delete RequestBank Image
router.route("/:id/image").delete(ctrlRequestBankController.deleteRequestBankImage);

export default router;
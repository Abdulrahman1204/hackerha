import { Router } from "express";
import verifyToken from "../../../middlewares/verifyToken";
import checkRole from "../../../middlewares/checkRole";
import { ctrlContentController } from "../../../controllers/banks/content/Content.controller";

const router: Router = Router();

// ~ Get => /api/hackit/ctrl/content ~ Get All Content
router.route("/").get(verifyToken, ctrlContentController.getAllContents);

// ~ Get => /api/hackit/ctrl/content/:id ~ Get Single Content
router.route("/:id").get(verifyToken, ctrlContentController.getSingleContent);

// ~ Get => /api/hackit/ctrl/content/bank/:bankId ~ Get Content by Bank ID
router.route("/bank/:bankId").get(verifyToken, ctrlContentController.getContentByBankId);

// ~ Post => /api/hackit/ctrl/content ~ Create New Content
router.route("/").post(ctrlContentController.createNewContent);

// ~ Put => /api/hackit/ctrl/content/:id ~ Update Content
router.route("/:id").put(ctrlContentController.updateContent);

// ~ Delete => /api/hackit/ctrl/content/:id ~ Delete Content
router.route("/:id").delete(ctrlContentController.deleteContent);

export default router;

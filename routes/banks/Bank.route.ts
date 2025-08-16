import { Router } from "express";
import { ctrlBanksController } from "../../controllers/banks/Bank.controller";
import upload from "../../middlewares/cloudinary";
import verifyToken from "../../middlewares/verifyToken";

const router: Router = Router();

// ~ Get => /api/hackit/ctrl/bank ~ Get All Banks
router.route("/").get(verifyToken, ctrlBanksController.getAllBanks);

// ~ Get => /api/hackit/ctrl/bank/:id ~ Get Single Bank
router.route("/:id").get(verifyToken, ctrlBanksController.getSingleBank);

// ~ Post => /api/hackit/ctrl/bank ~ Create New Bank
router.route("/").post(upload, ctrlBanksController.createNewBank);

// ~ Put => /api/hackit/ctrl/bank/:id ~ Update Bank
router.route("/:id").put(ctrlBanksController.updateBank);

// ~ Delete => /api/hackit/ctrl/bank/:id ~ Delete Bank
router.route("/:id").delete(ctrlBanksController.deleteBank);

// ~ put => /api/hackit/ctrl/bank/:id/image ~ Update Image Bank
router.route("/:id/image").put(upload, ctrlBanksController.updateImageBank);

export default router;

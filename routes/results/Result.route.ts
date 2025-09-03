import { Router } from "express";
import { ctrlResultController } from "../../controllers/result/Result.controller";

const router: Router = Router();

// ~ Get => /api/univers/ctrl/result ~ Get All Results
router.route("/").get(ctrlResultController.getAllResults);

// ~ Get => /api/univers/ctrl/result/student/:studentId ~ Get Results by Student ID
router
  .route("/student/:studentId")
  .get(ctrlResultController.getResultsByStudent);

// ~ Get => /api/univers/ctrl/result/:id ~ Get Result by ID
router.route("/:id").get(ctrlResultController.getResultById);

// ~ Post => /api/univers/ctrl/result ~ Create New Result
router.route("/").post(ctrlResultController.createResult);

// ~ Put => /api/univers/ctrl/result/:id ~ Update Result
router.route("/:id").put(ctrlResultController.updateResult);

// ~ Delete => /api/univers/ctrl/result/:id ~ Delete Result
router.route("/:id").delete(ctrlResultController.deleteResult);

export default router;

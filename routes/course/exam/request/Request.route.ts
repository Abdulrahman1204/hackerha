import { Router } from "express";
import { ctrlRequestController } from "../../../../controllers/courses/exam/request/Request.controller";
import upload from "../../../../middlewares/cloudinary";

const router: Router = Router();

// ~ Post => /api/univers/ctrl/request ~ Create New Request
router.route("/").post(upload, ctrlRequestController.createRequest);

// ~ Get => /api/univers/ctrl/request/:id ~ Get Request by ID
router.route("/:id").get(ctrlRequestController.getRequestById);

// ~ Get => /api/univers/ctrl/request/question/:questionId ~ Get Requests by Question ID
router
  .route("/question/:questionId")
  .get(ctrlRequestController.getRequestsByQuestionId);

// ~ Put => /api/univers/ctrl/request/:id ~ Update Request
router.route("/:id").put(upload, ctrlRequestController.updateRequest);

// ~ Put => /api/univers/ctrl/request/:id/image ~ Update Request Image
router
  .route("/:id/image")
  .put(upload, ctrlRequestController.updateRequestImage);

// ~ Delete => /api/univers/ctrl/request/:id ~ Delete Request
router.route("/:id").delete(ctrlRequestController.deleteRequest);

// ~ Delete => /api/univers/ctrl/request/question/:questionId ~ Delete All Requests for Question
router
  .route("/question/:questionId")
  .delete(ctrlRequestController.deleteRequestsByQuestionId);

// ~ Delete => /api/univers/ctrl/request/:id/image ~ Delete Request Image
router.route("/:id/image").delete(ctrlRequestController.deleteRequestImage);

export default router;

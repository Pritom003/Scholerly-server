import express from "express";
import auth from "../../middleware/auth";
import { ReviewController } from "./Review.controller";
import { USER_ROLE } from "../Auth/auth.constant";


const router = express.Router();

// Route to initiate SurjoPay payment
router.post('/', auth(USER_ROLE.admin,USER_ROLE.student,USER_ROLE.tutor),ReviewController.createReview);
router.get('/:tutorId', ReviewController.getProductReviews);
router.delete('/:reviewId',auth(USER_ROLE.admin,USER_ROLE.student,USER_ROLE.tutor), ReviewController.deleteReview);
router.put('/:reviewId',auth(USER_ROLE.admin,USER_ROLE.student,USER_ROLE.tutor), ReviewController.updateReview);

export const ReviewRoutes = router;


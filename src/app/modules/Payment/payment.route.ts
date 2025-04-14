import express from "express";
import { initiatePayment, verifyPayment } from "./paument.controller";
// import { initiatePayment, verifyPayment } from "../modules/Payment/payment.controller";

const router = express.Router();

// Route to initiate SurjoPay payment
router.get("/initiate/:bookingId", initiatePayment);

// Callback route for SurjoPay to verify payment
router.get("/verify/:bookingId", verifyPayment);

export const PaymentRoutes = router;

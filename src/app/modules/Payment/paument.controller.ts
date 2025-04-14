import { PaymentUtils } from './payment.utils';
import { Request, Response } from "express";
import CatchAsync from "../../utils/fetch.async";
import AppError from "../../Errors/AppError";
import { BookinServices } from "../Booking/booking.service";


export const initiatePayment = CatchAsync(async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';

  const booking = await BookinServices.getBookingById(bookingId);
  if (!booking || booking?.status !== "accepted") {
    throw new AppError(400, "Booking must be confirmed before payment");
  }

  const amount = booking.durationInHours * booking.ValuPerHour;
  // const student = await BookingService.getBookingStudent(bookingId); // Or booking.user if included

  const shurjopayPayload = {
    amount,
    order_id: bookingId,
    currency: "BDT",
    customer_name:"Student",
    customer_address:  "N/A",
    customer_email:  "student@example.com",
    customer_phone: "01800000000",
    customer_city: "Dhaka",
    client_ip: clientIp,
    return_url: process.env.SP_RETURN_URL!,
  };

  const payment = await PaymentUtils.makePaymentAsync(shurjopayPayload);

  if (payment?.transactionStatus === "Initiated") {
    // await BookinServices.updateTransaction(bookingId, {
    //   id: payment.sp_order_id,
    //   transactionStatus: payment.transactionStatus,
    // });
    res.send({ paymentUrl: payment.checkout_url });
    return;
  }

  throw new AppError(500, "Failed to initiate SurjoPay payment");
});
export const verifyPayment = CatchAsync(async (req: Request) => {
  const { bookingId } = req.params;

  const verifiedPayment = await PaymentUtils.verifyPaymentAsync(bookingId);
  const paymentData = verifiedPayment[0];

  if (!paymentData) {
    throw new AppError(404, "Payment not found");
  }
  if (verifiedPayment.length) {
  await BookinServices.updateBookingPaymentSuccess(bookingId, {
    bank_status: paymentData.bank_status,
    sp_code: paymentData.sp_code,
    sp_message: paymentData.sp_message,
    transactionStatus: paymentData.transaction_status,
    method: paymentData.method,
    date_time: paymentData.date_time,
    transactionId: paymentData.id, // Updated to match the correct property name in VerificationResponse
  });
  
  }

});


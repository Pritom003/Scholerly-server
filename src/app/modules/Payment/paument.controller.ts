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

  const amount = 1 * booking.ValuPerHour;
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
export const verifyPayment = CatchAsync(async (req: Request ,res:Response)  => {
  // const { bookingId } = req.params;
  const {bookingId}=req.params
  // console.log(bookingId,'hre');

  const verifiedPayment = await PaymentUtils.verifyPaymentAsync(bookingId);
  const paymentData = verifiedPayment[0];
// console.log(paymentData,'from here');
  if (!paymentData) {
    throw new AppError(404, "Payment not found");
  }
  if (paymentData?.sp_message=== 'Success') {
  await BookinServices.updateBookingPaymentSuccess(paymentData?.customer_order_id.toString(), {
    bank_status: paymentData.bank_status,
    sp_code: paymentData.sp_code,
    sp_message: paymentData.sp_message,
    transactionStatus: paymentData.transaction_status,
    method: paymentData.method,
    date_time: paymentData.date_time,
    totalAmout:paymentData.received_amount,
    transactionId: paymentData.id, // Updated to match the correct property name in VerificationResponse
  });
  res.status(200).json({ success: true, message: "Payment verified" }); // ✅ Add this
  return;
  }
  

});


/* eslint-disable @typescript-eslint/no-explicit-any */
import Shurjopay, { PaymentResponse, VerificationResponse } from 'shurjopay';
import config from '../../config';
// import config from '../../config';

const shurjopay = new Shurjopay();

shurjopay.config(
  config.sp_endpoint!,
  config.sp_username!,
  config.sp_password!,
  config.sp_prefix!,
  config.sp_return_url!,
);

// console.log(shurjopay);
const makePaymentAsync = async (paymentPayload: any): Promise<PaymentResponse> => {
  return new Promise((resolve, reject) => {
    shurjopay.makePayment(
      paymentPayload,
      (response: unknown) => resolve(response as PaymentResponse),
      (error: any) => {
        console.error("ShurjoPay Payment Error:", error);  // Log the error message
        reject(new Error("Payment failed. Please try again."));
      }
    );
  });
  
};


const verifyPaymentAsync = (
  order_id: string,
): Promise<VerificationResponse[]> => {
  return new Promise((resolve, reject) => {
    shurjopay.verifyPayment(
      order_id,
      (response: VerificationResponse[] | PromiseLike<VerificationResponse[]>) => resolve(response),
      (error: any) => reject(error),
    );
  });
};

export const PaymentUtils = {
  makePaymentAsync,
  verifyPaymentAsync,
};
// payment.service.ts

import { Payment,IPayment} from './payment.model';

const createPayment = async (data: IPayment) => {
  return await Payment.create(data);
};

export const PaymentService = { createPayment };

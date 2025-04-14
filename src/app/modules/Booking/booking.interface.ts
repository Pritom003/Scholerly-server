import { Types } from 'mongoose';

export type BookingStatus = 'pending' | 'accepted' | 'canceled' | 'Paid';

export interface IBooking {
  student: Types.ObjectId;     // Reference to User (student)
  tutor: Types.ObjectId;       // Reference to User (tutor)
  subject: string;
  bookingDate: Date;
  durationInHours: number;
  ValuPerHour: number;
  status: BookingStatus;
  paymentIntentId?: string;    // Optional: for Stripe/SSLCommerz
  createdAt?: Date;
  updatedAt?: Date;
  transaction?: {
    transactionId: string;
    transactionStatus: string;
    bank_status: string;
    sp_code: string;
    sp_message: string;
    method: string;
    date_time: string;
  };
}

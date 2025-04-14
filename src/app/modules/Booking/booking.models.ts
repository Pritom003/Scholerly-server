import { Schema, model } from 'mongoose';
import { IBooking } from './booking.interface';

const bookingSchema = new Schema<IBooking>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    tutor: { type: Schema.Types.ObjectId, ref: 'Tutor', required: true },
    subject: { type: String, required: true },
    bookingDate: { type: Date, required: true },
    durationInHours: { type: Number, required: true },
    ValuPerHour: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'canceled', 'Paid'], 
       default: 'pending' },
       paymentIntentId: { type: String },
       transaction: {
        transactionId: String,
         transactionStatus: String,
         bank_status: String,
         sp_code: String,
         sp_message: String,
         method: String,
         date_time: String,
       },
  },
  {
    timestamps: true,
  }
);

export const Booking = model<IBooking>('Booking', bookingSchema);

import { model, Schema, Types } from "mongoose";

export interface IPayment {
    studentId: Types.ObjectId;
    tutorId:  Types.ObjectId;
    bookingId:  Types.ObjectId;
    amount: number;
    status: 'Initiated' | 'Success' | 'Failed';
    time: Date;
  }


const paymentSchema = new Schema<IPayment>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tutorId: { type: Schema.Types.ObjectId, ref: 'Tutor', required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Initiated', 'Success', 'Failed'],
      default: 'Initiated',
    },
    time: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Payment = model<IPayment>('Payment', paymentSchema);

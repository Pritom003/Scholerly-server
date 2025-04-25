import { Schema, model } from 'mongoose';
import TNotification from './Notification.interface';




const notificationSchema = new Schema<TNotification>(
  {
    userId: { type: String , required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['booking', 'approval', 'message','review'], required: true },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Notification = model<TNotification>('Notification', notificationSchema);

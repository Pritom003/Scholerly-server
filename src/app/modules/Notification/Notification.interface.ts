import { Types } from "mongoose";

export  type NotificationType = 'booking' | 'approval' | 'message'|'review';

export default interface TNotification {
  _id?: string;
  userId: Types.ObjectId | string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt?: Date;
}

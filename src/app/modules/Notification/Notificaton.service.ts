import TNotification from "./Notification.interface";
import { Notification } from "./Notification.model";


const createNotification = async (payload: TNotification): Promise<TNotification> => {
  const notification = await Notification.create(payload);
  return notification;
};

const getUserNotifications = async (userId: string): Promise<TNotification[]> => {
  console.log(`Fetching notifications for user: ${userId}`);
  return Notification.find({ userId: userId }).sort({ createdAt: -1 });
};


const markAsRead = async (notificationId: string): Promise<TNotification | null> => {
  // First, mark it as read, then delete it from DB
  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { new: true }
  );

  // If notification was marked, now delete it
  if (notification) {
    await Notification.findByIdAndDelete(notificationId);
  }

  return notification;
};

export const NotificationService = {
  createNotification,
  getUserNotifications,
  markAsRead,
};

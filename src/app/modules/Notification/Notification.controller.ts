import { Request, Response } from 'express';
import { NotificationService } from './Notificaton.service';
// import { NotificationService } from './notification.service';

const createNotification = async (req: Request, res: Response) => {
  const result = await NotificationService.createNotification(req.body);
  res.status(201).json({ success: true, data: result });
};

const getUserNotifications = async (req: Request, res: Response) => {
  const { userId } = req.params;
  console.log(`Fetching notifications for user: ${userId}`);
  const result = await NotificationService.getUserNotifications(userId);
  res.status(200).json({ success: true, data: result });
};

const markAsRead = async (req: Request, res: Response) => {
  const { notificationId } = req.params;
  const result = await NotificationService.markAsRead(notificationId);
  res.status(200).json({ success: true, data: result });
};

export const NotificationController = {
  createNotification,
  getUserNotifications,
  markAsRead,
};

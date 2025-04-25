import express from 'express';
import { NotificationController } from './Notification.controller';


const router = express.Router();

router.post('/', NotificationController.createNotification);
router.get('/:userId', NotificationController.getUserNotifications);
router.patch('/read/:notificationId', NotificationController.markAsRead);

export const NotificationRoutes = router;

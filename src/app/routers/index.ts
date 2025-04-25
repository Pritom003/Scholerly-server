import express from 'express';
import { authRoutes } from '../modules/Auth/auth.router';
import { BookingRoutes } from '../modules/Booking/booking.router';
import { PaymentRoutes } from '../modules/Payment/payment.route';
import { TutorRoutes } from '../modules/Tutor/tutor.router';
import { ReviewRoutes } from '../modules/Review/Review.router';
import { NotificationRoutes } from '../modules/Notification/Notification.router';

const router = express.Router();

const moduleRoutes=[
 {
    path:'/auth',
    route:authRoutes
 },
 {
   path:'/',
   route:BookingRoutes
},
{
   path:'/payment',
   route:PaymentRoutes
},
{
   path:'/tutor',
   route:TutorRoutes
},
{
   path:'/review',
   route:ReviewRoutes
},
{
   path:'/notification',
   route:NotificationRoutes
},
]
moduleRoutes.forEach(route=>router.use(route.path,route.route))




export default router
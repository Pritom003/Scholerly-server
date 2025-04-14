import express from 'express';
import { authRoutes } from '../modules/Auth/auth.router';
import { BookingRoutes } from '../modules/Booking/booking.router';
import { PaymentRoutes } from '../modules/Payment/payment.route';
import { TutorRoutes } from '../modules/Tutor/tutor.router';

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
]
moduleRoutes.forEach(route=>router.use(route.path,route.route))




export default router
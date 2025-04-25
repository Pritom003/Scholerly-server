import express from 'express';

import { BookingController } from './booking.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../Auth/auth.constant';



// import StudentValidation  from '../students/student.validation';
const router = express.Router();

router.post(
  '/book-tutor',BookingController.createBooking
);
router.put(
  '/status/:bookingId',BookingController.updateBookingStatus
);
router.get('/all', BookingController.getAllBookings);
router.get('/student/:studentId',auth(USER_ROLE.student), BookingController.getBookingsByStudentId);
router.get('/tutorId/:tutorId',auth(USER_ROLE.tutor), BookingController.getBookingsByTutorId);
router.get('/payment-history', auth(USER_ROLE.student), BookingController.getPaymentHistory);
router.patch('/status/:bookingId',auth(USER_ROLE.tutor,USER_ROLE.admin), BookingController.updateBookingStatus);


export const BookingRoutes = router;
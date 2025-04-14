import express from 'express';

import { BookingController } from './booking.controller';



// import StudentValidation  from '../students/student.validation';
const router = express.Router();

router.post(
  '/book-tutor',BookingController.createBooking
);
router.put(
  '/status/:bookingId',BookingController.updateBookingStatus
);
router.get('/all', BookingController.getAllBookings);
router.get('/student/:studentId', BookingController.getBookingsByStudentId);
router.get('/my-tutor/:tutorId', BookingController.getBookingsByTutorId);

export const BookingRoutes = router;
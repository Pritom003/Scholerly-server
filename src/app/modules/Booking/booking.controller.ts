
import { Request, Response } from "express";
import CatchAsync from "../../utils/fetch.async";
import sendResponse from "../../utils/sendResponse";
import { BookinServices } from './booking.service';





 const createBooking = CatchAsync(async (req: Request, res: Response) => {
    const booking = await BookinServices.createBookingToDb(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Booking created successfully!',
      data: booking,
    });
  });


const updateBookingStatus = CatchAsync(async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const { status } = req.body;
    const updated = await BookinServices.updateStatus(bookingId, status);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Booking ${status} successfully!`,
      data: updated,
    });
  });
  
  const getAllBookings = CatchAsync(async (req: Request, res: Response) => {
    const bookings = await BookinServices.getAllBookings();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'All bookings retrieved successfully!',
      data: bookings,
    });
  });
  
  const getBookingsByStudentId = CatchAsync(async (req: Request, res: Response) => {
    const { studentId } = req.params;
    const bookings = await BookinServices.getBookingsByStudentId(studentId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Bookings for student ${studentId} retrieved successfully!`,
      data: bookings,
    });
  });
  
  const getBookingsByTutorId = CatchAsync(async (req: Request, res: Response) => {
    const { tutorId } = req.params;
    const bookings = await BookinServices.getBookingsByTutorId(tutorId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Bookings for tutor ${tutorId} retrieved successfully!`,
      data: bookings,
    });
  });
  

  export const BookingController = {
    createBooking,
    updateBookingStatus,
    getAllBookings,
    getBookingsByStudentId,
    getBookingsByTutorId,
  };
  
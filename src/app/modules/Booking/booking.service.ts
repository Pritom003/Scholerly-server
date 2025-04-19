import app from "../../../app";
import AppError from "../../Errors/AppError";
import { IBooking } from "./booking.interface";
import { Booking } from "./booking.models";

const createBookingToDb = async (payload: IBooking): Promise<IBooking> => {
  const newBooking = await Booking.create(payload);

  // Emit notification to the tutor
  const io = app.get('io');
  if (io) {
    io.to(payload.tutor.toString()).emit('newBooking', {
      message: 'You have a new booking request!',
      booking: newBooking,
    });
  }
  // as i am sending the notification to the logged in user so if i add the tutor userid i can gett the notification 

  return newBooking;
};

const updateStatus = async (id: string, status: string): Promise<IBooking | null> => {
  const updatedBooking = await Booking.findByIdAndUpdate(id, { status }, { new: true });

  // Emit notification to the student
  const io = app.get('io');
  if (io && updatedBooking) {
    let message = '';

    if (status === 'accepted') {
      message = '✅ Your booking has been accepted!';
    } else if (status === 'canceled') {
      message = '❌ Unfortunately, your booking was rejected.';
    } else {
      message = `Booking status updated to "${status}".`;
    }

    io.to(updatedBooking.student.toString()).emit('bookingUpdated', {
      message,
      booking: updatedBooking,
    });
  }

  return updatedBooking;
};


const getBookingById = async (id: string) => {
  try {
    const booking = await Booking.findById(id)
      .populate("tutor")
      .populate("student");
    if (!booking) {
      throw new AppError(404, "Booking not found.");
    }
    return booking;
  } catch (error) {
    throw new AppError(500, (error as Error)?.message || "Error fetching booking");
  }
};


// export const updateTransaction = async (
//   bookingId: string,
//   transaction: { id: string; transactionStatus: string }
// ): Promise<IBooking | null> => {
//   return Booking.findByIdAndUpdate(
//     bookingId,
//     { transaction },
//     { new: true }
//   );
// };

export const updateBookingPaymentSuccess = async (
  bookingId: string,
  paymentData: Record<string, any>
): Promise<IBooking | null> => {
  console.log(bookingId, paymentData, "paymentData");
  return Booking.findByIdAndUpdate(
    bookingId,
    {
      transaction: paymentData,
      status: paymentData.bank_status === "Success" ? "Paid" : "pending",
    },
    { new: true }
  );
};
// Get all bookings
const getAllBookings = async (): Promise<IBooking[]> => {
  return Booking.find()
    .populate('student')
    .populate('tutor')
    .sort({ createdAt: -1 });
};

// Get bookings by student ID
const getBookingsByStudentId = async (studentId: string): Promise<IBooking[]> => {
  return Booking.find({ student: studentId })
    .populate('student')
    .populate('tutor')
    .sort({ createdAt: -1 });
};

// Get bookings by tutor ID
const getBookingsByTutorId = async (tutorId: string): Promise<IBooking[]> => {
  return Booking.find({ tutor: tutorId })
    .populate('student')
    .populate('tutor')
    .sort({ createdAt: -1 });
};

export const BookinServices = {
  createBookingToDb,
  updateStatus,
  getBookingById,
  updateBookingPaymentSuccess,
  getAllBookings,
  getBookingsByStudentId,
  getBookingsByTutorId,
};

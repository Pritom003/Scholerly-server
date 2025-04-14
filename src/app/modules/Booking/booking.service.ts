import AppError from "../../Errors/AppError";
import { IBooking } from "./booking.interface";
import { Booking } from "./booking.models";

const createBookingToDb = async (payload: IBooking): Promise<IBooking> => {
  const newBooking = await Booking.create(payload);
  // Notify tutor via email or socket here
  return newBooking;
};

const updateStatus = async (id: string, status: string): Promise<IBooking | null> => {
  return Booking.findByIdAndUpdate(id, { status }, { new: true });
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

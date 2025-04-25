
import QueryBuilder from "../../Builder/queryBuilder";
import AppError from "../../Errors/AppError";
import { NotificationService } from "../Notification/Notificaton.service";
import { IBooking } from "./booking.interface";
import { Booking } from "./booking.models";

const createBookingToDb = async (payload: IBooking): Promise<IBooking> => {
  const newBooking = await Booking.create(payload);

  await NotificationService.createNotification({
    userId: payload.tutor.toString(),
    message: '📆 You have a new booking request!',
    type: 'booking',
    isRead: false,
  });
  

  return newBooking;
};

const updateStatus = async (id: string, status: string): Promise<IBooking | null> => {
  const updatedBooking = await Booking.findByIdAndUpdate(id, { status }, { new: true });

  // Emit notification to the student
  const message = `📆 Your booking status has been ${status}ed .`;
  if (updatedBooking && updatedBooking.student) {
    await NotificationService.createNotification({
      userId: updatedBooking.student.toString(),
      message,
      type: 'booking',
      isRead: false,
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
// Service
const getAllBookings = async (query: Record<string, any>) => {
  const queryBuilder = new QueryBuilder<IBooking>(
    Booking.find().populate('student').populate('tutor'),
    query
  )
    .searchAndFilter(['student.name', 'tutor.name', 'transaction.transactionId'])
    .sort()
    .paginate();

  const data = await queryBuilder.modelQuery;
  const total = await queryBuilder.getCountQuery();

  return {
    data,
    meta: {
      total,
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 6,
      totalPages: Math.ceil(total / (Number(query.limit) || 6)),
    },
  };
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
const getPaymentHistoryByStudentId = async (studentId: string) => {
  return Booking.find({ student: studentId, status: "Paid" }).populate("tutor");
};

export const BookinServices = {
  createBookingToDb,
  updateStatus,
  getBookingById,
  updateBookingPaymentSuccess,
  getAllBookings,
  getBookingsByStudentId,
  getBookingsByTutorId,getPaymentHistoryByStudentId
};


import { ObjectId } from 'mongodb';
import { TReview } from './Riview.interface';
import ReviewModel from './Riview.model';
import AppError from '../../Errors/AppError';
import { Tutor } from '../Tutor/tutor.model';
import { USER_ROLE } from '../Auth/auth.constant';

import { NotificationService } from '../Notification/Notificaton.service';
import { Users } from '../Auth/auth.models';



export const createReview = async (reviewData: TReview, userId: string) => {
  const objectUserId = new ObjectId(userId)
  reviewData.userId = objectUserId

  // Create the review
  const review = await ReviewModel.create(reviewData)

  // Recalculate average rating and total reviews for the tutor
  const stats = await ReviewModel.aggregate([
    {
      $match: { tutorId: new ObjectId(reviewData.tutorId) },
    },
    {
      $group: {
        _id: '$tutorId',
        totalReviews: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ])

  const { totalReviews, avgRating } = stats[0] || {
    totalReviews: 0,
    avgRating: 0,
  }

  // Update Tutor information with new review stats
  await Tutor.findByIdAndUpdate(
    reviewData.tutorId,
    {
      totalReviews,
      rating: avgRating,
    },
    { new: true }
  )

  // Fetch full user info for the notification message (optional)
  const userInfo = await Users.findById(userId)  // Assuming you have a UserModel

  // Send notification to the tutor about the new review
  await NotificationService.createNotification({
    userId: reviewData.tutorId,  // Send notification to the tutor
    message: userInfo ? `🧑‍🎓 Student "${userInfo.name}" posted a review on your profile!` : '🧑‍🎓 A student posted a review on your profile!',
    type: 'review',
    isRead: false,
  })

  return review
}


    const  getReviewsBytutorId= (tutorId: string) => {
      const allreview= ReviewModel.find({tutorId:tutorId}).populate('userId', 'name email Profileimage').sort({ createdAt: -1 });
      return allreview;
    }
  
    const deleteReview = async (reviewId: string, userId: string,isadmin:string) => {
      const review = await ReviewModel.findById(reviewId);
      if (!review) throw new AppError (401,'Review not found');
      if (review.userId.toString() !== userId ||isadmin===USER_ROLE.admin ) {
       throw new AppError (401,'Unauthorized to delete this review');
      }
      return  ReviewModel.findByIdAndDelete(reviewId);
    }
  
    const updateReview = async (reviewId: string, userId: string, updateData: Partial<TReview>) => {
      const review = await ReviewModel.findById(reviewId);
      if (!review) throw new Error('Review not found');
      if (review.userId.toString() !== userId) {
        throw new AppError (401,'Unauthorized to delete this review');
      }
      return  ReviewModel.findByIdAndUpdate(reviewId, updateData, { new: true });
    }
    const getAllReviews = async () => {
      return ReviewModel.find()
        .populate('userId')
        .populate('tutorId')
        .sort({ createdAt: 1 }).limit(3);
    };
    
    export const ReviewService = { createReview, getReviewsBytutorId, deleteReview, updateReview,getAllReviews };
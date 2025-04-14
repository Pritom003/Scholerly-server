import { ObjectId } from 'mongodb';
import { TReview } from './Riview.interface';
import ReviewModel from './Riview.model';
import AppError from '../../Errors/AppError';
import { Tutor } from '../Tutor/tutor.model';



  
export const createReview = async (reviewData: TReview, user: string) => {
    // Attach user ID to review
    reviewData.userId = new ObjectId(user);
  
    // Create the review
    const review = await ReviewModel.create(reviewData);
  
    // Use aggregation to get total reviews and average rating
    const stats = await ReviewModel.aggregate([
      {
        $match: { tutorId: new ObjectId(reviewData.tutorId) }
      },
      {
        $group: {
          _id: '$tutorId',
          totalReviews: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      }
    ]);
  
    const { totalReviews, avgRating } = stats[0] || {
      totalReviews: 0,
      avgRating: 0
    };
  
    // Update tutor with new stats
    await Tutor.findByIdAndUpdate(
      reviewData.tutorId,
      {
        totalReviews,
        rating: avgRating
      },
      { new: true }
    );
  
    return review;
  };
    const  getReviewsBytutorId= (tutorId: string) => {
      const allreview= ReviewModel.find({tutorId:tutorId}).populate('userId', 'name email Profileimage').sort({ createdAt: -1 });
      return allreview;
    }
  
    const deleteReview = async (reviewId: string, userId: string, isAdmin: boolean) => {
      const review = await ReviewModel.findById(reviewId);
      if (!review) throw new AppError (401,'Review not found');
      if (review.userId.toString() !== userId && !isAdmin) {
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
    
    export const ReviewService = { createReview, getReviewsBytutorId, deleteReview, updateReview };
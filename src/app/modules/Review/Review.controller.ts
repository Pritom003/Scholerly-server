import { JwtPayload } from 'jsonwebtoken';

import { Request, Response } from 'express';
import CatchAsync from '../../utils/fetch.async';
import sendResponse from '../../utils/sendResponse';
import { ReviewService } from './Review.service';


export const createReview = CatchAsync(async (req: Request, res: Response) => {
    const userId = (req?.user as JwtPayload)?.id?.toString(); // Extract user ID as string

  if (!userId) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'User ID is required',
      data: null,
    });
  }
  const review = await ReviewService.createReview(req.body, userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'review Created  successfully',
    data: review,
  });
});

export const getProductReviews = CatchAsync(async (req: Request, res: Response) => {
  const { tutorId } = req.params;
  const reviews = await ReviewService.getReviewsBytutorId(tutorId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Reviews found successfully',
    data: reviews,
  });
});

export const deleteReview = CatchAsync(async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const userId= req.user?.id; 
  const isadmin  = req.user.role; // Assuming userId and isAdmin are passed in the request body
  if (!userId) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'User ID is required',
      data: null,
    });
  }
  await ReviewService.deleteReview(reviewId, userId,isadmin);
  res.status(200).json({ success: true, message: 'Review deleted' });
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Review deleted',
    data: {}
  });
});
  
const gealltreviews = CatchAsync(async (req: Request, res: Response) => {
  const reviews= await ReviewService.getAllReviews();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All reviews retrieved successfully!',
    data: reviews,
  });
});
export const updateReview = CatchAsync(async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const { userId } = req.body; // Assuming userId is passed in the request body
  const updatedReview = await ReviewService.updateReview(reviewId, userId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Review updated',
    data: updatedReview,
  });
});


export const ReviewController = { createReview, getProductReviews, deleteReview, updateReview,gealltreviews };
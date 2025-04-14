// import { Model } from "mongoose";
import { model } from "mongoose";

import { Schema } from "mongoose";
import { TReview, TReviewModel } from "./Riview.interface";



  
  const ReviewSchema = new Schema<TReview, TReviewModel>(
    {
      tutorId: {
        type: Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true,
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        maxlength: 500,
      },
    },
    { timestamps: true }
  );
  

  
  
  const ReviewModel = model<TReview, TReviewModel>('Reviews', ReviewSchema);
  export default ReviewModel;
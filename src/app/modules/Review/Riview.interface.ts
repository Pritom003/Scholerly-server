import { Model, Types } from "mongoose";

export interface TReview {
    tutorId:Types.ObjectId;
    userId: Types.ObjectId;
    rating: number;
    comment?: string;
    createdAt?: Date;
  }
  export interface TReviewModel extends Model<TReview> {
    findByProductId(productId: string): Promise<TReview[]>;
  }
 
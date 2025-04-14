import { Types } from "mongoose";

export interface IName {
    firstName: string;
    lastName: string;
  }
  export interface IAvailability {
    day: string;     // e.g., "Monday"
    from: string;    // e.g., "10:00"
    to: string;      // e.g., "14:00"
  }
  export type LoginProvider = 'credentials' | 'google' | 'github';

  
export interface ITutor {
    role: 'tutor';
    name: IName;
    email: string;
    phone?: string;
    id: string;
    user: Types.ObjectId;
    profileImage?: string;
    bio?: string;
  
    subjects: string[];
    hourlyRate: number;
    discountRate?: number;
  
    availability: IAvailability[];
  
    rating?: number;
    totalReviews?: number;
  
    password?: string;
    isVerified?: boolean;
    loginProvider: LoginProvider;
    request?: 'pending' | 'approved' | 'rejected';
    location?: string;
    qualifications?: string[];
  
    createdAt?: Date;
    updatedAt?: Date;
  }
  
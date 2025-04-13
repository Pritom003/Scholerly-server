import { Schema, model } from 'mongoose';
import { ITutor } from './tutor.interface';

const TutorSchema = new Schema<ITutor>(
  {
    role: {
      type: String,
      enum: ['tutor'],
      default: 'tutor',
    },
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    profileImage: { type: String },  
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id is required'],
      unique: true,
      ref: 'User',
    },
    bio: { type: String, maxlength: 1000 },

    // Subjects and specialization
    subjects: [{ type: String, required: true }], // e.g., ["Math", "Biology"]

    // Rates
    hourlyRate: { type: Number, required: true },
    discountRate: { type: Number }, // Optional discount

    // Availability
    availability: [
      {
        day: { type: String }, // e.g., "Monday"
        from: { type: String }, // e.g., "10:00"
        to: { type: String },   // e.g., "14:00"
      },
    ],

    // Rating and reviews
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },

    // Authentication Info (normal/email login)
    password: { type: String },
    isVerified: { type: Boolean, default: false },
    loginProvider: {
      type: String,
      enum: ['credentials', 'google', 'github'],
      default: 'credentials',
    },

    // Optional fields
    location: { type: String },
    qualifications: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const Tutor = model<ITutor>('Tutor', TutorSchema);

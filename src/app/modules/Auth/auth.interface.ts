import { Model } from 'mongoose';
import { IName } from '../Tutor/tutor.interface';
export interface UserInterface {
  _id: string;
  name:IName;
  email: string;
  password: string;
  Profileimage:string;
  role: 'tutor ' | 'student' | 'admin';
  status: 'in-progress' | 'accepted' | 'rejected';
  isDeleted?: boolean;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
}

export interface UserModel extends Model<UserInterface> {
  isUserExists(email: string): Promise<UserInterface | null>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
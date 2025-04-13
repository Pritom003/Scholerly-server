
// import  { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../Errors/AppError';
import { User } from './auth.models';
import { UserInterface } from './auth.interface';
import AuthUtils from './auth.utils';
import mongoose from 'mongoose';
import { Tutor } from '../Tutor/tutor.model';



// const login = async (payload: TLoginUser) => { 
//   console.log("Received login payload:", payload);

//   const user = await User.isUserExists(payload.email);
//   console.log("User found in DB:", user);

//   if (!user) {
//     throw new AppError(404, 'No user found with this email');
//   }

//   console.log("Entered Password:", payload.password);
//   console.log("Stored Hashed Password:", user.password);
//   const isPasswordMatched = await User.isPasswordMatched(payload.password, user.password);
//   console.log("Password Match Result:", isPasswordMatched);
  
//   console.log("Password matched:", isPasswordMatched);

//   if (!isPasswordMatched) {
//     throw new AppError(401, 'Invalid password');
//   }

//   const jwtPayload = {
//     id: user._id,
//     email: user.email,
//     role: user.role,
//     image: user.Profileimage || '',
//   };

//   const accessToken = AuthUtils.CreateToken(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     config.jwt_access_token_expires_in as string,
//   );

//   return { accessToken };
// };


const register = async (payload: UserInterface) => {
  const isUserExists = await User.isUserExists(payload.email);
  if (isUserExists) {
    throw new AppError(400, 'User already exists');
  }

  // Start session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Create user
    const user = new User(payload);
    await user.save({ session });

    // 2. If the user is a tutor, create a Tutor entry
    if (payload.role === 'tutor') {
      const tutorData = {
        name: user.name,
        email: user.email,
        profileImage: user.Profileimage,
        user: user._id,
        // set placeholder values for required fields
        subjects: ['Unknown'], // default until updated
        hourlyRate: 0, // default until updated
      };

      await Tutor.create([tutorData], { session });
    }

    // 3. Commit transaction
    await session.commitTransaction();
    session.endSession();

    // 4. Create Tokens
    const jwtPayload = {
      id: user._id,
      email: user.email,
      image: user.Profileimage,
      role: user.role,
      status: user.status,
    };

    const accessToken = AuthUtils.CreateToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_token_expires_in as string,
    );

    const refreshToken = AuthUtils.CreateToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_token_expires_in as string,
    );

    return { accessToken, refreshToken };

} catch (error) {
    // ✅ Abort only if session is still in transaction
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    throw error;
  }
};


// const RefreshToken = async (refreshToken: string) => {
//   if (!config.jwt_refresh_secret) {
//     throw new AppError(500, 'JWT refresh secret is not defined');
//   }
//   const decoded = AuthUtils.VerifyToken(refreshToken, config.jwt_refresh_secret) as JwtPayload;
//   const user = await User.findOne({ _id: decoded.id, is_blocked: false });
//   if (!user) throw new AppError(404, 'No user found');

//   const jwtPayload = { id: user._id, email: user.email, role: user.role, image: user.Profileimage };
//   if (!config.jwt_access_secret || !config.jwt_access_token_expires_in) {
//     throw new AppError(500, 'JWT configuration is not defined');
//   }
//   const accessToken = AuthUtils.CreateToken(jwtPayload, config.jwt_access_secret, config.jwt_access_token_expires_in);

//   return { accessToken };
// };



export const AuthService = { register };
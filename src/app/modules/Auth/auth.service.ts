import bcrypt from 'bcrypt';

// import  { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../Errors/AppError';
// import { User } from './auth.models';
import { UserInterface } from './auth.interface';
import AuthUtils from './auth.utils';
import mongoose from 'mongoose';
import { Tutor } from '../Tutor/tutor.model';
import { USER_ROLE } from './auth.constant';
import { uploadToCloudinary } from '../../utils/UploadtoCloudinary';
import { Users } from './auth.models';
import { JwtPayload } from 'jsonwebtoken';
import QueryBuilder from '../../Builder/queryBuilder';

import { NotificationService } from '../Notification/Notificaton.service';




const login = async (payload: UserInterface) => { 

  const user = await Users.isUserExists(payload.email);

  if (!user) {
    throw new AppError(404, 'No user found with this email');
  }
  const isPasswordMatched = await Users.isPasswordMatched(payload.password, user.password);

  if (!isPasswordMatched) {
    throw new AppError(401, 'Invalid password');
  }

  const jwtPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
    image: user.Profileimage || '',
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
  return { accessToken,refreshToken };
};


const register = async (payload: UserInterface, files: any) => {
  const isUserExists = await Users.isUserExists(payload.email);
  if (isUserExists) {
    throw new AppError(400, 'User already exists');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = new Users(payload);

    // Upload Profile Image to Cloudinary
    if (files && files.ProfileImage && files.ProfileImage[0]) {
      const file = files.ProfileImage[0];
      const result = await uploadToCloudinary(
        file.buffer,
        `profile_${Date.now()}`,
        file.mimetype
      ) as { secure_url: string };

      const profileImageUrl = result.secure_url;
      user.Profileimage = profileImageUrl || '';
    }

    await user.save({ session });

    // If role is tutor, create a Tutor entry
    if (payload.role === USER_ROLE.tutor) {
      const tutorData = {
        ...payload,
        user: user._id,
        profileImage: user.Profileimage,
      };

      await Tutor.create([tutorData], { session });
      await NotificationService.createNotification({
        userId: 'admin', // or actual admin user ID if dynamic
        message: `🧑‍🏫 New tutor "${user.name}" has registered.`,
        type: 'approval',
        isRead: false,
      });
      
    }

    await session.commitTransaction();
    session.endSession();

    // Create access & refresh tokens
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
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    throw error;
  }
};




const RefreshToken = async (refreshToken: string) => {
  if (!config.jwt_refresh_secret) {
    throw new AppError(500, 'JWT refresh secret is not defined');
  }
  const decoded = AuthUtils.VerifyToken(refreshToken, config.jwt_refresh_secret) as JwtPayload;
  const user = await Users.findOne({ _id: decoded.id, is_blocked: false });
  if (!user) throw new AppError(404, 'No user found');

  const jwtPayload = { id: user._id, email: user.email, role: user.role, image: user.Profileimage, status: user.status };
  if (!config.jwt_access_secret || !config.jwt_access_token_expires_in) {
    throw new AppError(500, 'JWT configuration is not defined');
  }
  const accessToken = AuthUtils.CreateToken(jwtPayload, config.jwt_access_secret, config.jwt_access_token_expires_in);

  return { accessToken };
};


const GetMyProfile = async (user :UserInterface) => {
  const result = await Users.findOne({
    email: user.email,
  
  }).select(' -createdAt -updatedAt');

  if (!result) {
    throw new AppError(404, 'User not found');
  }

  return result;
};

const GetAllUSers = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(Users.find({ role: { $in: [USER_ROLE.student, USER_ROLE.admin, USER_ROLE.tutor] } }), query);

  const users = await queryBuilder
    .searchAndFilter(['name', 'email','role'])
    .filter()
    .sort()
    .fields()
    .modelQuery.select('-password -updatedAt');

  const total = await queryBuilder.getCountQuery();

  return {
    meta: {
      total,
      ...queryBuilder.getPaginationInfo(),
    },
    data: users,
  };
};


const updateMyProfile = async (files: any, user: any, data: any) => {
  try {
    const existingUser = await Users.findById(user.id).select("+password");
    if (!existingUser) {
      throw new AppError(404, "User not found");
    }

    // ✅ Handle optional image upload
    if (files?.ProfileImage?.[0]) {
      const file = files.ProfileImage[0]; // ✅ Get the first uploaded file

      const result = await uploadToCloudinary(
        file.buffer,
        `profile_${Date.now()}`,
        file.mimetype
      ) as { secure_url: string };

      existingUser.Profileimage = result.secure_url;
      console.log('✅ New profile image uploaded:', result.secure_url);
    }

    // ✅ Password update check
    if (
      data.oldPassword &&
      !(await Users.isPasswordMatched(data.oldPassword, existingUser.password))
    ) {
      throw new AppError(401, "Old password does not match");
    }

    if (data.newPassword) {
      const newHashedPassword = await bcrypt.hash(
        data.newPassword,
        Number(config.bcrypt_salt_rounds)
      );
      existingUser.password = newHashedPassword;
      existingUser.needsPasswordChange = false;
      existingUser.passwordChangedAt = new Date();
    }

    // ✅ Update other fields
    existingUser.name = data.name || existingUser.name;

    await Users.findByIdAndUpdate(existingUser.id, existingUser);
    return existingUser;
  } catch (error: any) {
    throw new AppError(error.statusCode || 500, error.message || "Something went wrong");
  }
};


const BlockUser = async (UserID: string) => {
  const targatedUser = await Users.findById(UserID);

  if (!targatedUser) {
    throw new AppError(404, 'User not found');
  }



  await Users.findByIdAndUpdate(UserID, {
    is_blocked: targatedUser.is_blocked ? false : true,
  });
};
const MakeAdmin = async (targetUserId: string) => {
  const user = await Users.findById(targetUserId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.role === "admin") {
    throw new AppError(400, "User is already an admin");
  }

  user.role = "admin";
  await user.save();
};

const RemoveAdmin = async (UserId: string) => {
  const user = await Users.findById(UserId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.role === "student" )  {
    throw new AppError(400, "User is not an admin");
  }

  user.role = "student";
  await user.save();
};

const DeleteUser = async (UserId: string) => {
  const user = await Users.findByIdAndDelete(UserId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return { message: "User deleted successfully" };
};
const ApproveTutor = async (userId: string, status: "in-progress" | "accepted" | "rejected") => {
  const user = await Users.findById(userId);

  if (!user || user.role !== USER_ROLE.tutor) {
    throw new AppError(404, "Tutor not found or invalid role");
  }

  if (user.status === 'accepted') {
    throw new AppError(400, "Tutor already approved");
  }

  user.status = status;
  await user.save();

  await NotificationService.createNotification({
    userId: user._id.toString(),
    message: '✅ Congratulations! Your tutor profile has been approved.',
    type: 'approval',
    isRead: false,
  });
  
  return {
    message: "Tutor approved successfully",
  };
};


export const AuthService = 
{ register ,
  login,
   DeleteUser,
  RemoveAdmin,
  MakeAdmin,
  BlockUser,
  GetMyProfile,
  updateMyProfile,
  GetAllUSers,
  RefreshToken,ApproveTutor
 
};
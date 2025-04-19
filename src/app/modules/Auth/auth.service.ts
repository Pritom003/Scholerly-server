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

  return { accessToken };
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
    is_blocked: false,
  }).select('-is_blocked -createdAt -updatedAt');

  if (!result) {
    throw new AppError(404, 'User not found');
  }

  return result;
};

// const GetAllCustomers = async (query: Record<string, unknown>) => {
//   const queryBuilder = new QueryBuilder(User.find({ role: ['USER', 'ADMIN'] }), query);

//   const users = await queryBuilder
//     .search(['name', 'email'])
//     .filter()
//     .sort()
//     .fields()
//     .modelQuery.select('-password -updatedAt');

//   const total = await queryBuilder.getCountQuery();

//   return {
//     meta: {
//       total,
//       ...queryBuilder.getPaginationInfo(),
//     },
//     data: users,
//   };
// };


const updateMyProfile = async (files: any, user: any, data: any) => {
  try {
    // console.log("Received files in service:", files);  // Check if files are received properly
    const existingUser = await Users.findById(user.id).select("+password");
    if (!existingUser) {
      // console.error("User not found");
      throw new AppError(404, "User not found");
    }
    // console.log("User found:", existingUser); // Confirm the user is found

    // If file exists, upload to Cloudinary
    const file = files;
    // console.log("Uploading image:", file);  // Log the file before uploading
    const result = await uploadToCloudinary(file.buffer, `profile_${Date.now()}`, file.mimetype) as { secure_url: string };
    const profileImageUrl = result.secure_url;
    // console.log("Uploaded image URL:", profileImageUrl);  // Log the URL after upload
    existingUser.Profileimage = profileImageUrl;  // Set the new profile image URL

    // Check and update password if provided
    if (data.oldPassword && !(await Users.isPasswordMatched(data.oldPassword, existingUser.password))) {
      // console.error("Old password does not match");
      throw new AppError(401, 'Old password does not match');
    }

    // Update the password if provided
    if (data.newPassword) {
      const newHashedPassword = await bcrypt.hash(data.newPassword, Number(config.bcrypt_salt_rounds));
      existingUser.password = newHashedPassword;
      existingUser.needsPasswordChange = false;
      existingUser.passwordChangedAt = new Date();
    }

    // Update user details
    existingUser.name = data.name || existingUser.name;
    // console.log("Updating user:", existingUser);

    // Save updated user data
    await Users.findByIdAndUpdate(existingUser.id, existingUser);
    // console.log("User updated successfully");

    return existingUser;
  } catch (error: any) {
    // console.error("Error occurred:", error);  // Log the error if any occurs
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

export const AuthService = 
{ register ,
  login,
   DeleteUser,
  RemoveAdmin,
  MakeAdmin,
  BlockUser,
  GetMyProfile,
  updateMyProfile,
  // GetAllCustomers
  RefreshToken

};
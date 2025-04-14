
import { Request, Response ,Express} from 'express';
import CatchAsync from '../../utils/fetch.async';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';
import AppError from '../../Errors/AppError';
import { UserInterface } from './auth.interface';

// import AppError from '../Errors/AppErrors';

const register = CatchAsync(async (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

const data = JSON.parse(req.body.formdata); 

console.log(data ,files , "data i am receriving from postman as formdata");
  const result = await AuthService.register(data,files);
  // const result = await AuthService.register(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const login = CatchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Login successful',
    data: result,
  });
});



const GetMyProfile = CatchAsync(async (req, res) => {
  const user = req.user as UserInterface;
  
  if (!user || !user._id) {
    throw new AppError(401, 'Unauthorized');
  }
  const result = await AuthService.GetMyProfile(user);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User profile fetched successfully',
    data: result,
  });
});

// const getAlltheUser = CatchAsync(async (req, res) => {
//   const result = await AuthService.GetAllCustomers(req.query);

//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: 'Customers fetched successfully',
//     // meta: result.meta,
//     data: result.data,
//   });
// });
const updateMyProfile = CatchAsync(async (req, res) => {
  // console.log("Received file:", req.file);  // Log to confirm the file is received
  const { oldPassword, newPassword, ...body } = req.body;
  const files = req.file;  // Single file uploaded
  const user = req.user;
  // console.log(user);

  const result = await AuthService.updateMyProfile(files, user, { ...body, oldPassword, newPassword });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Profile updated successfully',
    data: result,
  });
});

const blockUser = CatchAsync(async (req, res) => {
  const { userId } = req.params;
  

  await AuthService.BlockUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User blocked successfully',
    data: {},
  });
});
const makeAdmin = CatchAsync(async (req, res) => {
  const { userId } = req.params;
  await AuthService.MakeAdmin(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User is now an Admin",
    data: {},
  });
});

const removeAdmin = CatchAsync(async (req, res) => {
  const { userId } = req.params;
  await AuthService.RemoveAdmin(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Admin role removed",
    data: {},
  });
});

const deleteUser = CatchAsync(async (req, res) => {
  const { userId } = req.params;
  await AuthService.DeleteUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User deleted successfully",
    data: {},
  });
});

export const AuthController = {
  register,
  login,
  GetMyProfile,
  deleteUser,
  removeAdmin,
  makeAdmin,
  // getAlltheUser,
  blockUser,
  updateMyProfile
};
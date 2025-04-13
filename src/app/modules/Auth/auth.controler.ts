
import { Request, Response ,Express} from 'express';
import CatchAsync from '../../utils/fetch.async';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';

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

// const login = CatchAsync(async (req: Request, res: Response) => {
//   const result = await AuthService.login(req.body);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Login successful',
//     data: result,
//   });
// });


export const AuthController = {
  register,
//   login
};
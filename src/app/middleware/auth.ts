import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import CatchAsync from '../utils/fetch.async';
import config from '../config';
// import User from '../modules/Auth/User.model';
import httpStatus from 'http-status';
import AppError from '../Errors/AppError';
import { Users } from '../modules/Auth/auth.models';
// import { Users } from '../modules/Auth/auth.models';
const auth=(...requiredRoles: string[])=>{
    return CatchAsync(async(req:Request,res:Response ,
        next:NextFunction)=>
        
        {
        // console.log(req.headers.authorization,requiredRoles);
        const token =req.headers.authorization
        console.log(token);
        // hey gpt why the token is undefined here hey gpt 
        if(!token)
        {
            throw new AppError(httpStatus.FORBIDDEN,`Unauthorized User `);
        }
        const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
        const decoded = jwt.verify(actualToken, config.jwt_access_secret);
       
      
        const {role,email}=decoded as JwtPayload
        const user=await Users.isUserExists(email)
if(!user){
    throw new AppError(401,`Invalid credentials`);
}
// const BlockedUser=await User.isUserBlocked(email)
// if(BlockedUser){

//     throw new AppError(httpStatus.FORBIDDEN,`The user is blocked `);
// }
const isUserisDeleted=user?.isDeleted
if(isUserisDeleted){
    throw new AppError(httpStatus.FORBIDDEN,`The user is deleted `);
}

 if(requiredRoles && !requiredRoles.includes(role)){
    throw new AppError(httpStatus.FORBIDDEN,`Unauthorized User `);
  }
     req.user=decoded as JwtPayload



     next()
        
        })
   
}
export default auth
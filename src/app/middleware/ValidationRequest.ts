// import {AnyZodObject} from 'zod'
// import { NextFunction, Request, Response } from 'express';
// import CatchAsync from '../utils/fetch.async';
// const validationRequest=(schema:AnyZodObject)=>{
//     return CatchAsync(async(req:Request,res:Response ,
//         next:NextFunction)=>
        
//         {
//         await schema.parseAsync({
//                 body:req.body,
//                 cookies:req.cookies
//             })

//          next()})
   
// }
// export default validationRequest
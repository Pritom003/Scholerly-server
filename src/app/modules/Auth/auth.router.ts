import express from 'express';
import { AuthController } from './auth.controler';
import { uploadFields } from '../../middleware/upload';



// import StudentValidation  from '../students/student.validation';
const router = express.Router();
router.post(
  '/create-user',uploadFields([
    { name: 'ProfileImage', maxCount: 1 },
  ]),AuthController.register
);

export const authRoutes = router;
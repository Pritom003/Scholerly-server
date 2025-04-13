import express from 'express';
import { AuthController } from './auth.controler';



// import StudentValidation  from '../students/student.validation';
const router = express.Router();
router.post(
  '/create-user',AuthController.register
);

export const authRoutes = router;
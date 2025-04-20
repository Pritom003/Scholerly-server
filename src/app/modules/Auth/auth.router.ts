import express from 'express';
import { AuthController } from './auth.controler';
import { uploadFields } from '../../middleware/upload';
import auth from '../../middleware/auth';
import { USER_ROLE } from './auth.constant';



// import StudentValidation  from '../students/student.validation';
const router = express.Router();

router.post(
  '/create-user',uploadFields([
    { name: 'ProfileImage', maxCount: 1 },
  ]),AuthController.register
);
router.post('/login', AuthController.login);
router.post(
  '/refresh-token',

  AuthController.refreshToken
);
router.get(
  '/profile',
  auth(USER_ROLE.admin, USER_ROLE.student,USER_ROLE.tutor),
  AuthController.getMyProfile,
);
router.post(
  '/profile',
  auth(USER_ROLE.admin, USER_ROLE.student,USER_ROLE.tutor),
  uploadFields([
    { name: 'ProfileImage', maxCount: 1 },
  ]),
  AuthController.updateMyProfile
);
export const authRoutes = router;
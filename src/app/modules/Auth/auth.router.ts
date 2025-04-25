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
router.get('/',auth(USER_ROLE.admin),AuthController.getAlltheUser)
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
router.patch('/block-user/:userId',auth(USER_ROLE.admin) , AuthController.blockUser)
router.patch('/make-admin/:userId',auth(USER_ROLE.admin) , AuthController.makeAdmin)
router.patch('/approve-tutor/:userId',auth(USER_ROLE.admin) , AuthController.approveTutor)
router.delete('/:userId',auth(USER_ROLE.admin) , AuthController.deleteUser)
export const authRoutes = router;
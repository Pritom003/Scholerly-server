import express from 'express';
import { TutorController } from './tutor.controler';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../Auth/auth.constant';


const router = express.Router();

router.get('/', TutorController.getAllTutors);

// ,auth(USER_ROLE.admin,USER_ROLE.student,USER_ROLE.tutor),
router.get('/:id',auth(USER_ROLE.tutor,USER_ROLE.admin,USER_ROLE.student), TutorController.getSingleTutor);
router.patch('/:id',auth(USER_ROLE.tutor,USER_ROLE.admin), TutorController.updateTutorProfile);
router.patch('/request/:id',auth(USER_ROLE.admin), TutorController.approveTutorRequest);

export const TutorRoutes = router;

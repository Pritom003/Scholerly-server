import express from 'express';
import { TutorController } from './tutor.controler';


const router = express.Router();

router.get('/', TutorController.getAllTutors);
router.get('/:id', TutorController.getSingleTutor);
router.patch('/:id', TutorController.updateTutorProfile);
router.patch('/approve/:id', TutorController.approveTutorRequest);

export const TutorRoutes = router;

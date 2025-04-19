
import httpStatus from 'http-status';

import CatchAsync from '../../utils/fetch.async';
import sendResponse from '../../utils/sendResponse';
import { TutorService } from './tutor.service';
import AppError from '../../Errors/AppError';
// import { Tutor } from './tutor.model'; 
import { USER_ROLE } from '../Auth/auth.constant';
import { Users } from '../Auth/auth.models';
import { Tutor } from './tutor.model';


const getAllTutors= CatchAsync(async (req, res)=> {
    const result = await TutorService.getAllTutors(req.query);

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'All Tutor  fetched successfully',
        data: result,
      });
  })

  const getSingleTutor= CatchAsync(async (req, res)=> {
    const { id } = req.params;
    const result = await TutorService.getSingleTutor(id);
 
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: ' Tutor  fetched successfully',
        data: result,
      });
  })
  const updateTutorProfile = CatchAsync(async (req, res) => {
    const { id } = req.params; // Tutor ID to update
    const updatedData = req.body;
    const loggedInUserId = req.user.id;
  
    // Get full user object to check role
    const loggedInUser = await Users.findById(loggedInUserId);
  
    if (!loggedInUser) {
      throw new AppError(404, 'Logged-in user not found');
    }
  
    // Find tutor by ID
    const tutor = await Tutor.findById(id);
    if (!tutor) {
      throw new AppError(404, 'Tutor not found');
    }
  
    // Allow if the logged-in user is the owner (tutor.user === loggedInUserId) or is an admin
    const isOwner = tutor.user.toString() === loggedInUserId;
    const isAdmin = loggedInUser.role === USER_ROLE.admin;
  
    if (!isOwner && !isAdmin) {
      throw new AppError(403, 'You are not authorized to update this profile');
    }
  
    const result = await TutorService.updateTutorProfile(id, updatedData);
  
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Tutor updated successfully',
      data: result,
    });
  });
  
  const approveTutorRequest= CatchAsync(async (req, res)=> {
    const { id } = req.params;
    const updateData = req.body; // directly get update fields

  const result = await TutorService.approveTutorRequest(id, updateData);
  const fieldValue = Object.values(updateData)[0];

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `Tutor ${fieldValue}ed successfully.`,
        data: result,
      });
   
  })
  export const TutorController = 
  {
    approveTutorRequest ,updateTutorProfile ,getSingleTutor,getAllTutors

  };

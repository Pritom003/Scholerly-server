
import httpStatus from 'http-status';

import CatchAsync from '../../utils/fetch.async';
import sendResponse from '../../utils/sendResponse';
import { TutorService } from './tutor.service';


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

  const updateTutorProfile= CatchAsync(async (req, res)=> {
    const { id } = req.params;
    const updatedData = req.body;
    const result = await TutorService.updateTutorProfile(id, updatedData);
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Tutor  updated successfully',
        data: result,
      });
  })

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

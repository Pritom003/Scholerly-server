import { Tutor } from './tutor.model';
import { ITutor } from './tutor.interface';
import QueryBuilder from '../../Builder/queryBuilder';
import { UpdateQuery } from 'mongoose';


  const getAllTutors=async (query: Record<string, any>) => {


    const tutorsQuery = Tutor.find(); // initial mongoose query

    const queryBuilder = new QueryBuilder<ITutor>(tutorsQuery, query)
      .searchAndFilter(['name', 'subjects', 'specialization', 'bio']) // searchable fields
      .filter()
      .sort()
      .paginate()
      .fields();
  
    const tutors = await queryBuilder.modelQuery;
    const total = await queryBuilder.getCountQuery();
    return {tutors ,total};
  }

  const getSingleTutor= async (id: string) => {
    return Tutor.findById(id);
  }

  const updateTutorProfile=async (id: string, updatedData: Partial<ITutor>) => {
    return Tutor.findByIdAndUpdate(id, updatedData, { new: true });
  }

 const  approveTutorRequest= async (id: string ,request: UpdateQuery<ITutor> | undefined) => {
    return Tutor.findByIdAndUpdate(id, request, { new: true });
  }
  export const TutorService = {getAllTutors,getSingleTutor,updateTutorProfile,approveTutorRequest};

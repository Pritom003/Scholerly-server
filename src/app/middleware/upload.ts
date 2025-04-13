/* middlewares/upload.middleware.ts */
import multer from 'multer';
import { RequestHandler } from 'express';

const storage = multer.memoryStorage();

const upload = multer({ storage });

// Reusable function to get upload middleware based on field definitions
export const uploadFields = (fields: { name: string; maxCount?: number }[]): RequestHandler => {
  return upload.fields(fields);
};

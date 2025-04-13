import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  if (!res.headersSent) {
    res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: 'API Not Found !!',
      error: '',
    });
  } else {
    next();
  }
};

export default notFound;

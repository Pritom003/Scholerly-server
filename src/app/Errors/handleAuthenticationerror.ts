import { TGenericErrorResponse } from '../interface/error';

const handleAuthenticationError = (
  err: any,
  statusCode: number = 401,
  message: string = 'Authentication Error'
): TGenericErrorResponse & { err: any; stack?: string } => ({
  statusCode,
  message,
  errorSources: [
    {
      path: '',
      message: err?.message || message,
    },
  ],
  err: {
    name: err?.name || 'AuthenticationError',
    message: err?.message || message,
  },
  stack: err?.stack,
});

export default handleAuthenticationError;

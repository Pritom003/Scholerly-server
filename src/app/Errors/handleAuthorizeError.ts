import { TGenericErrorResponse } from '../interface/error';

const handleaAuthorizationError = (
  err: any,
  statusCode: number = 401,
  message: string = 'AUTHORIZATION ERROR '
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
    name: err?.name || 'AUTHORIZATIONRROR',
    message: err?.message || message,
  },
  stack: err?.stack,
});

export default handleaAuthorizationError;

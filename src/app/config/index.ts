import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT || 5000, 
  default_pass: process.env.DB_PASSWORD,
  NODE_ENV: process.env.Node_Env,
  DB_URL: process.env.DB_URL as string,
  bycrypt_pass: process.env.DEFAULT_PASSWORD as string,
  access_token: process.env.Access_Token as string,
  refresh_token: process.env.Refresh_Token as string,
  access_expiredIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as string,
  refresh_expiredIn_token: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as string,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

  jwt_access_secret: process.env.JWT_ACCESS_SECRET as string,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET as string,
  jwt_access_token_expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as string,
  jwt_refresh_token_expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as string,
};

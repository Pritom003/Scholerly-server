import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT || 5000, 
  default_pass:process.env.DB_PASSWORD,
  NODE_ENV:process.env.Node_Env,
  DB_URL: process.env.DB_URL as string,
  bycrypt_pass: process.env.DEFAULT_PASSWORD as string,
  access_token :process.env.Access_Token as string,
  refresh_token :process.env.Refresh_Token as string,
  access_expiredIn :process.env.Access_Expired_In as string,
  refresh_expiredIn_token :process.env.Permanent_Expired_In as string
};
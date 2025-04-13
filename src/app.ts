
import cors from 'cors';
import cookieParser from'cookie-parser'
import express, { Application,  NextFunction,  Request, Response } from 'express';

import os from "os";
import router from './app/routers';
import globalErrorHandler from './app/middleware/globalerrorHandler';
import notFound from './app/middleware/NotFound';
const app: Application = express();

// Middleware to parse JSON and handle CORS
app.use(express.json());
app.use(cookieParser())
app.use(cors());

// app Routes
app.use('/api/v1', router);


// Root route
app.get("/", (req: Request, res: Response, next: NextFunction) => {
    const currentDateTime = new Date().toISOString();
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const serverHostname = os.hostname();
    const serverPlatform = os.platform();
    const serverUptime = os.uptime();
  
    res.status(200).json({
      success: true,
      message: "Welcome to the Next Mart",
      version: "1.0.0",
      clientDetails: {
        ipAddress: clientIp,
        accessedAt: currentDateTime,
      },
      serverDetails: {
        hostname: serverHostname,
        platform: serverPlatform,
        uptime: `${Math.floor(serverUptime / 60 / 60)} hours ${Math.floor(
          (serverUptime / 60) % 60
        )} minutes`,
      },
      developerContact: {
        email: "njahanpritom65@gmail.com",
        website: "https://github.com/Pritom003",
      },
    });
    next()
  });



app.use(globalErrorHandler);
app.use(notFound)
export default app;
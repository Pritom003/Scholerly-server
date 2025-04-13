import sharp from 'sharp';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import config from '../config';

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

// ✅ Upload Image to Cloudinary From Buffer with sharp compression
export const uploadToCloudinary = (fileBuffer: Buffer, fileName: string, mimetype: string):
 Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        // Use sharp to resize or compress the image before uploading
        sharp(fileBuffer)
          .resize(1200)  // Example: Resize the image width to 1200px (adjust as needed)
          .toBuffer()
          .then((compressedBuffer) => {
            cloudinary.uploader.upload_stream(
              {
                resource_type: 'auto',  // Automatically detect the file type (image, video, etc.)
                public_id: fileName,  // Custom file name for Cloudinary
                format: mimetype.split('/')[1],  // Explicitly set the format based on the MIME type
              },
              (error, result: UploadApiResponse | undefined) => {
                if (error) {
                    return reject(error);  // Reject on error
                }
                if (!result) {
                    return reject(new Error("Upload failed, no result returned from Cloudinary."));  // Handle empty result
                }
                resolve(result);  // Resolve with the successful result
              }
            ).end(compressedBuffer);  // Upload the resized/compressed image buffer
          })
          .catch((error) => {
            reject(error);  // Reject if sharp throws an error (e.g., invalid image format)
          });
    });
};

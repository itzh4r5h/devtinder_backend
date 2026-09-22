import multer from 'multer';
import { CustomError } from '../middlewares/error-middleware.js'
import ImageKit from "imagekit";

// initializing imagekit with credentials from env
export const imagekitInstance = new ImageKit({
  publicKey: PUBLIC_KEY,
  privateKey: PRIVATE_KEY,
  urlEndpoint: URL_ENDPOINT
});

// configuring multer for handling file uploads in memory
const maxSize = 2 * 1024 * 1024
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new CustomError("Only png and jpeg and webp images are allowed", 400), false);
    }
    cb(null, true);
  },
});

// function to upload image on imagekit.io
export const uploadToImageKit = async (fileBuffer, fileName, folder) => {
  try {
    const result = await imagekitInstance.upload({
      file: fileBuffer.toString("base64"), // convert buffer to base64
      fileName,
      folder,
    });

    return {
      url: result.url,
      fileId: result.fileId,
    };
  } catch (error) {
    return new CustomError("Error while uploading...", 500);
  }
};


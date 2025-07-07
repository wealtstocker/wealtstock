import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

export const getUploadMiddleware = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `wealtstocker/${folderName}`, // uploads go into Cloudinary folders
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 800, crop: "limit" }],
    },
  });

  return multer({ storage });
};

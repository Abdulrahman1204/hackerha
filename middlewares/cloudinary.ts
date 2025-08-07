import path from "path";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { Request } from "express";
import { ICloudinaryFile } from "../utils/types";

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dq9y7eo0x",
  api_key: "598684435333266",
  api_secret: "NE_8ymvrzUhD7yfOYL-zUchD8ow",
});


// Create Cloudinary storage engine
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: Request, file: ICloudinaryFile) => {
    const ext = path.extname(file.originalname).toLowerCase();
    let resourceType: "auto" | "raw" | "video" = "auto";
    
    if (ext === ".pdf" || ext === ".docx" || ext === ".xlsx" || ext === ".csv") {
      resourceType = "raw";
    } else if (ext === ".mp4" || ext === ".avi" || ext === ".mov") {
      resourceType = "video";
    }
    
    return {
      folder: "HackIt",
      public_id: `${Date.now()}_${file.originalname.split('.')[0]}`,
      resource_type: resourceType,
      allowed_formats: ["jpg", "jpeg", "png", "mp4", "avi", "mov", "pdf"],
      type: "upload"
    };
  },
});

// Create multer upload middleware
const upload = multer({ storage }).single("attachedFile");

export default upload;
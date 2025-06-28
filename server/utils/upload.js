
import multer from "multer";

const storage = multer.memoryStorage(); // Changed to memoryStorage

function fileFilter(req, file, cb) {
  const allowedMimeTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/webp" // Added webp support for consistency
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false); // Better error handling
  }
}

export const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit (recommended)
  }
});
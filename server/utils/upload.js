
import multer from "multer";

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

// File filter to allow only specific image types
function fileFilter(req, file, cb) {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

// Export the configured multer middleware
export const upload = multer({ storage, fileFilter });

// middleware/upload.js
import multer from "multer";
import path from "path";

// Use memory storage so files are not written to disk
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf'
  };
  const extension = path.extname(file.originalname).toLowerCase();
  const mimetype = allowedTypes[extension] === file.mimetype;

  if (mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images and PDF files are allowed."));
  }
};

// Configure multer
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 16,
    fields: 50
  },
  fileFilter,
});

// Single file
export const uploadSingle = (fieldName) => upload.single(fieldName);

// Multiple files
export const uploadMultiple = (fieldName, maxCount = 10) => upload.array(fieldName, maxCount);

// Mixed fields
export const uploadFields = (fields) => upload.fields(fields);

// Error handler
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ success: false, message: "File too large (max 10MB)." });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ success: false, message: "Too many files uploaded." });
    }
  }

  if (err.message?.includes("Invalid file type")) {
    return res.status(400).json({ success: false, message: err.message });
  }

  next(err);
};

export default upload;

// routes/upload.js
import express from 'express';
import { uploadSingle, uploadMultiple, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

router.post('/single', uploadSingle('file'), (req, res) => {
  res.json({
    success: true,
    message: 'File uploaded successfully',
    data: {
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`
    }
  });
});

router.post('/multiple', uploadMultiple('files', 10), (req, res) => {
  const files = req.files.map(file => ({
    filename: file.filename,
    path: `/uploads/${file.filename}`
  }));
  
  res.json({
    success: true,
    message: 'Files uploaded successfully',
    data: { files }
  });
});

router.use(handleUploadError);

export default router;
import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import logger from '../utils/logger';

const router = Router();

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `recipe-${uniqueSuffix}${extension}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.UPLOAD_MAX_SIZE || '5242880', 10), // 5MB default
  },
});

// Upload single image
router.post('/image', authenticate, upload.single('image'), asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  try {
    // Optimize image with sharp
    const optimizedPath = path.join(uploadDir, `optimized-${req.file.filename}`);
    
    await sharp(req.file.path)
      .resize(800, 600, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 })
      .toFile(optimizedPath);

    // Remove original file
    fs.unlinkSync(req.file.path);

    // Generate URL for the optimized image
    const imageUrl = `/uploads/optimized-${req.file.filename}`;

    logger.info(`Image uploaded successfully: ${imageUrl}`);

    res.json({
      success: true,
      imageUrl,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    logger.error('Error processing uploaded image:', error);
    
    // Clean up files if processing failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      error: 'Error processing image',
      message: 'Failed to process uploaded image',
    });
  }
}));

// Upload multiple images
router.post('/images', authenticate, upload.array('images', 5), asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  
  if (!files || files.length === 0) {
    res.status(400).json({ error: 'No files uploaded' });
    return;
  }

  try {
    const imageUrls: string[] = [];
    
    for (const file of files) {
      // Optimize each image
      const optimizedPath = path.join(uploadDir, `optimized-${file.filename}`);
      
      await sharp(file.path)
        .resize(800, 600, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80 })
        .toFile(optimizedPath);

      // Remove original file
      fs.unlinkSync(file.path);

      // Generate URL for the optimized image
      const imageUrl = `/uploads/optimized-${file.filename}`;
      imageUrls.push(imageUrl);
    }

    logger.info(`Multiple images uploaded successfully: ${imageUrls.length} images`);

    res.json({
      success: true,
      imageUrls,
      message: `${imageUrls.length} images uploaded successfully`,
    });
  } catch (error) {
    logger.error('Error processing uploaded images:', error);
    
    // Clean up files if processing failed
    if (files) {
      files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    
    res.status(500).json({
      error: 'Error processing images',
      message: 'Failed to process uploaded images',
    });
  }
}));

export default router; 
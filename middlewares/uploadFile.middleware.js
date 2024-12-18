import multer from "multer";
import { v4 as uuidv4 } from 'uuid';

// //! single file upload 
// Configure multer for file uploads
// const upload = multer({ dest: 'uploads/' });

// // Specify 'file' as the field name for the uploaded file and limit the upload to 2 files
// const uploadSingleFile = upload.single('file');
// ? ________________________________________________________________
// ! multiple files upload at the same time
// Configure multer for file uploads
// const upload = multer({ dest: 'uploads/' });

// // Specify 'file' as the field name for the uploaded file and limit the upload to 2 files
// const uploadMultipleFiles = upload.array('file', 2);

//! multiple fields upload at the same time in case we have avatar or resume upload file
// // Configure multer for file uploads
// const upload = multer({ dest: 'uploads/' });

// // * configure multiple fields upload 
// const multiUpload = upload.fields([
//   { name: "avatar", maxCount: 1 },
//   { name: "resume", maxCount: 1 }
// ])
// // Specify 'file' as the field name for the uploaded file and limit the upload to 2 files
// const uploadSingleFile = multiUpload;


// ----------------------------------------------------------------
//! multiple files upload at the same time with custom name  localy uploaded

// /// to customize file upload name 
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     const { originalname } = file;
//     cb(null, `${uuidv4()}-${originalname}`);
//   }
// });

// // filter to only take images 
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.split('/')[0] === 'image') {
//     cb(null, true);
//   } else {
//     cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false);
//   }
// };
// // Configure multer for file uploads
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 1024 * 1024 * 5, files: 1 } // 5MB and only takes 1 file
// });

// // Specify 'file' as the field name for the uploaded file and limit the upload to 2 files
// const uploadMultipleFilesWithCustomName = upload.array('file');



//! updaload single file to s3 aws using memory storage 
/// to customize file upload name
const storage = multer.memoryStorage();

// filter to only take images 
const fileFilter = (req, file, cb) => {
  if (file.mimetype.split('/')[0] === 'image') {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false);
  }
};
// Configure multer for file uploads
const upload = multer({
  storage,
  fileFilter,
  // limits: { fileSize: 1024 * 1024 * 50, files: 1 } // 5MB and only takes 1 file
});

// Specify 'file' as the field name for the uploaded file and limit the upload to 2 files
const uploadSingleFileToS3 = upload.array('file');

//! upload multile file to s3 aws using all promises


//! error handler from multer error 
const multerErrorHandler = (upload) => (req, res, next) => {
  upload(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum size is 5MB' });
      } else if (error.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ message: 'Too many files uploaded. Only 1 file is allowed' });
      } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ message: 'Only images are allowed, file must be an image type' });
      }
    }
    next();
  });
};

export {
  uploadSingleFileToS3,
  multerErrorHandler
};
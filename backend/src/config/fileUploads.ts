// import dotenv from 'dotenv';
// import multer from 'multer';
// import cloudinary from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';

// dotenv.config();

// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary.v2,
//   params: {
//     folder: 'tutor_proofs',
//     allowed_formats: ['jpg', 'png', 'pdf'],
//   },
// });

// const upload = multer({ storage: storage });

// export { upload, cloudinary };
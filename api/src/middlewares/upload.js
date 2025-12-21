import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../cloudinaryConfig/index.js'; // El que creamos antes

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'productos_jade', // Carpeta donde se guardarán en Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }] // Opcional: redimensiona automáticamente
    },
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB máximo
});

export default upload;
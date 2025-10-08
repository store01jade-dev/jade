// middleware/upload.js

import multer from 'multer';

// Usamos el almacenamiento en memoria (MemoryStorage) porque es el mejor
// para luego enviar los archivos a servicios en la nube (ej., Cloudinary, AWS S3).
const storage = multer.memoryStorage();

// Configuramos Multer para aceptar hasta 5 imágenes
// El nombre del campo ('images') DEBE coincidir con el que usamos en el frontend (FormData.append('images', file)).
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB por archivo
}).array('images', 5); // Acepta un array de archivos en el campo 'images', con un máximo de 5.

export default upload;
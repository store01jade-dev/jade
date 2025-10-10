// middleware/upload.js

import multer from 'multer';

// Usamos el almacenamiento en memoria (MemoryStorage) porque es el mejor
// para luego enviar los archivos a servicios en la nube (ej., Cloudinary, AWS S3).
const storage = multer.memoryStorage();

// Configuramos Multer para aceptar hasta 5 imágenes
// El nombre del campo ('images') DEBE coincidir con el que usamos en el frontend (FormData.append('images', file)).
const multerInstance = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB por archivo, Acepta un array de archivos en el campo 'images', con un máximo de 5.
});

// Exportamos la instancia para poder usar .array(), .single(), etc., en las rutas.
export default multerInstance;
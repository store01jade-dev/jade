// middleware/upload.js

import multer from 'multer';
import path from 'path';
import fs from 'fs'; 
import { fileURLToPath } from 'url';

// Definición de la ruta absoluta para 'uploads'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Ajusta la ruta: sale de 'middleware' (..), entra a 'uploads'
const UPLOADS_PATH = path.join(__dirname, '..', 'uploads'); 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Asegurar que la carpeta exista antes de guardar
        if (!fs.existsSync(UPLOADS_PATH)) {
            console.log(`Creando directorio: ${UPLOADS_PATH}`);
            fs.mkdirSync(UPLOADS_PATH, { recursive: true });
        }
        // Le dice a Multer dónde guardar
        cb(null, UPLOADS_PATH);
    },
    filename: (req, file, cb) => {
        // Genera un nombre único y seguro
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        // La URL que se guarda es: nombre_campo-unique_id.extension
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

const multerInstance = multer({ 
    // Usar diskStorage para que se guarde en el disco
    storage: storage, 
    limits: { fileSize: 5 * 1024 * 1024 },
});

export default multerInstance;
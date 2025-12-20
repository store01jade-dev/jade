// Importamos express(Framework para levantar servidot HTTP con middlewares y rutas)
import express from "express";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from "url";

// Importamos las rutas
import userRoutes from "../src/routes/userRoutes.js";
import categoriasRoutes from "../src/routes/categoriaRoutes.js";
import productoRoutes from "../src/routes/productoRoutes.js";
import varianteImagenRoutes from "../src/routes/productoImagenRoutes.js";
import varianteProductoRoutes from "../src/routes/varianteProductoRoutes.js";
import commetRoutes from "../src/routes/commentsRoutes.js";
import pedidoRoutes from "../src/routes/pedidoRoutes.js";
import contactRoutes from "../src/routes/contactRoutes.js";
import orderRoutes from "../src/routes/pedidoRoutes.js";


// Creamos la instancia principal de la aplicacion Express
const app = express();

//Midleware para que Express pueda interpretar JSON en el body de las requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "https://jade-rouge.vercel.app",
    credentials: true
}));
/*CRÍTICO: Servir el directorio 'uploads'
// Asegúrate de que esta ruta apunte a la carpeta 'uploads' donde guardas las imágenes.
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));*/

// --- CONFIGURACIÓN DE RUTA ABSOLUTA (CRÍTICO) ---

// Si usas ES Modules (import/export), necesitas definir __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Definir la ruta exacta a 'uploads'
// Si tu carpeta 'uploads' está en el mismo nivel que server.js:
const UPLOADS_PATH = path.join(__dirname, 'uploads'); 

// Si tu carpeta 'uploads' está en el directorio raíz del proyecto (un nivel arriba de server.js):
// const UPLOADS_PATH = path.join(__dirname, '..', 'uploads'); 

// LOG: Muestra la ruta en la consola para VERIFICAR si es correcta
console.log(`Sirviendo archivos estáticos desde la ruta: ${UPLOADS_PATH}`); 

app.use(express.json());

// 2. CRÍTICO: Configurar el middleware estático
// Primer argumento: el prefijo URL que el navegador usará (/uploads)
// Segundo argumento: la ruta absoluta del sistema de archivos (UPLOADS_PATH)
app.use('/uploads', express.static(UPLOADS_PATH)); 

// Usar rutas de usuarios bajo el perfijo /api/users
app.use("/api/users", userRoutes);
app.use("/api/v1/categorias", categoriasRoutes);
app.use("/api/v1/productos", productoRoutes);
app.use("/api/v1/variantes", varianteProductoRoutes);
app.use("/api/v1/imagenes", varianteImagenRoutes);
app.use('/api/v1', pedidoRoutes);
app.use('/api/v1/contact', contactRoutes);

// Montar Rutas de comentarios
app.use('/api/v1/comments', commetRoutes);

//Rutas para los pedidos
app.use('/api/v1/orders', orderRoutes);


app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Y asegúrate de tener una para la raíz
app.get('/', (req, res) => {
  res.status(200).send('Backend Jade E-commerce Online');
});

// Exportamos app para que pueda ser utilizado por server.js
export default app;

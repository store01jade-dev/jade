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

// 3. Rutas de prueba/Healthcheck (Para que Railway vea que estás vivo)
app.get('/', (req, res) => res.send('Backend Jade Online'));
app.get('/health', (req, res) => res.send('OK'));

//Midleware para que Express pueda interpretar JSON en el body de las requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// En tu Backend (archivo de configuración de CORS)
const allowedOrigins = [
  'https://jade-wheat.vercel.app',    // La nueva URL que te dio Vercel
  'https://jade-rouge.vercel.app',    // Tu URL anterior
  'http://localhost:5173'             // Para tus pruebas locales
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como Postman o Insomnia)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Error de CORS: Este origen no está permitido por la política de seguridad.'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const UPLOADS_PATH = path.join(process.cwd(), 'uploads');
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

// Exportamos app para que pueda ser utilizado por server.js
export default app;



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

app.get('/', (req, res) => res.send('Backend Jade Online'));
app.get('/health', (req, res) => res.send('OK'));

//Midleware para que Express pueda interpretar JSON en el body de las requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  'https://jade-wheat.vercel.app',
  'https://jade-ewjv.onrender.com', //servidor back-end
  'http://localhost:5173', //para pruebas locales
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // 1. Permitir peticiones sin origen (como Postman o pings de Render)
    if (!origin) return callback(null, true);

    // 2. Verificar si el origen está en la lista fija
    const isAllowed = allowedOrigins.includes(origin);

    // 3. Verificar si el origen es una URL de previsualización de Vercel (Regex)
    // Esto acepta cualquier cosa que empiece por 'https://jade-' y termine en '.vercel.app'
    const isVercelPreview = origin.startsWith('https://jade-') && origin.endsWith('.vercel.app');

    if (isAllowed || isVercelPreview) {
      callback(null, true);
    } else {
      console.log("Bloqueado por CORS:", origin);
      callback(new Error('Error de CORS: Origen no permitido'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
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
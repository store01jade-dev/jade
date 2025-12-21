


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

// 1. Configuración básica de CORS (esto suele ser suficiente para la mayoría de casos)
app.use(cors());

// 2. Para solucionar el error del asterisco que te salió antes
app.options('/*', cors());

//Midleware para que Express pueda interpretar JSON en el body de las requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
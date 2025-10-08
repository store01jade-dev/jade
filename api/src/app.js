// Importamos express(Framework para levantar servidot HTTP con middlewares y rutas)
import express from "express";
import cors from "cors";

// Importamos las rutas
import userRoutes from "../src/routes/userRoutes.js";
import categoriasRoutes from "../src/routes/categoriaRoutes.js";
import productoRoutes from "../src/routes/productoRoutes.js";
import varianteImagenRoutes from "../src/routes/productoImagenRoutes.js";
import varianteProductoRoutes from "../src/routes/varianteProductoRoutes.js";


// Creamos la instancia principal de la aplicacion Express
const app = express();

//Midleware para que Express pueda interpretar JSON en el body de las requests
app.use(express.json());
app.use(cors())

// Usar rutas de usuarios bajo el perfijo /api/users
app.use("/api/users", userRoutes);
app.use("/api/v1/categorias", categoriasRoutes);
app.use("/api/v1/productos", productoRoutes);
app.use("/api/v1/variantes", varianteProductoRoutes);
app.use("/api/v1/imagenes", varianteImagenRoutes);

// Exportamos app para que pueda ser utilizado por server.js
export default app;

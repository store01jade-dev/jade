// Importamos express(Framework para levantar servidot HTTP con middlewares y rutas)
import express from "express";

// Importamos las rutas
import userRoutes from "../src/routes/userRoutes.js"

// Creamos la instancia principal de la aplicacion Express
const app = express();

//Midleware para que Express pueda interpretar JSON en el body de las requests
app.use(express.json());

// Usar rutas de usuarios bajo el perfijo /api/users
app.use("/api/users", userRoutes);


// Exportamos app para que pueda ser utilizado por server.js
export default app;

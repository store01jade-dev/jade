// Importamos la aplicacion Express que configuramos en app.js
import app from "./src/app.js";
//import { testConnection } from "./src/config/db.js";
import {sequelize} from "./src/models/index.js";
import dotenv from "dotenv";

// Definimos el puerto en el que se ejecutara la API
// Si no existe en el .env, usamos 3000 por defecto
dotenv.config();

const PORT = process.env.PORT || 8080;

// 1. ARRANCAMOS EL SERVIDOR PRIMERO
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});

// 2. LUEGO INTENTAMOS LA CONEXIÓN A LA DB (Sin bloquear el inicio)
async function connectDB() {
    try {
        console.log("Intentando conectar a la DB...");
        await sequelize.authenticate();
        console.log("✅ Conexión establecida correctamente con MySQL");
        await sequelize.sync(); 
        console.log("✅ Tablas recreadas con éxito");
    } catch (error) {
        console.error("❌ Error de conexión a la BD: ", error.message);
        // No matamos el proceso (process.exit) para que Railway no lo marque como fallo
    }
}

connectDB();
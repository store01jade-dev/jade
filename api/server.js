// Importamos la aplicacion Express que configuramos en app.js
import app from "./src/app.js";
//import { testConnection } from "./src/config/db.js";
import {sequelize} from "./src/models/index.js";
import dotenv from "dotenv";

// Definimos el puerto en el que se ejecutara la API
// Si no existe en el .env, usamos 3000 por defecto
dotenv.config();

const PorToUse = process.env.PORT;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la DB establecida.');

    // Luego el sync normal
    await sequelize.sync();
    console.log('✅ Tablas sincronizadas.');
    console.log('Tablas sincronizadas correctamente.');

    app.listen(PorToUse, '0.0.0.0', () => {
      console.log(`🚀 Servidor activo en puerto: ${PorToUse}`);
    });
  } catch (error) {
    console.error('Error al conectar:', error);
    process.exit(1);
  }
}


startServer();
// Importamos la aplicacion Express que configuramos en app.js
import app from "./src/app.js";
//import { testConnection } from "./src/config/db.js";
import {sequelize} from "./src/models/index.js";
import dotenv from "dotenv";

// Definimos el puerto en el que se ejecutara la API
// Si no existe en el .env, usamos 3000 por defecto
dotenv.config();

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a DB Exitosa');
    await sequelize.sync();
    
    app.listen(process.env.PORT || 10000, '0.0.0.0', () => {
      console.log('🚀 Servidor corriendo perfectamente');
    });
  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1); 
  }
};

startServer();
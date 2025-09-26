// Importamos la aplicacion Express que configuramos en app.js
import app from "./src/app.js";
import { testConnection } from "./src/config/db.js";

// Importamos dotenv para leer variables de entorno del archivo .env
import dotenv from "dotenv";

// Cargamos las variables de entorno
dotenv.config();

// Definimos el puerto en el que se ejecutara la API
// Si no existe en el .env, usamos 3000 por defecto
const PORT = process.env.PORT || 3000;

// levantamos el servidor y escuchamos en el puerto definido
testConnection().then(() => {
    app.listen(PORT, ()=>{
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
});
// Importamos la aplicacion Express que configuramos en app.js
import app from "./src/app.js";
//import { testConnection } from "./src/config/db.js";
import {sequelize} from "./src/models/index.js";
import dotenv from "dotenv";

// Definimos el puerto en el que se ejecutara la API
// Si no existe en el .env, usamos 3000 por defecto
dotenv.config();

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => res.status(200).send('Servidor Vivo'));

// 2. Función Principal de Arranque
const startServer = async () => {
    try {
        // ARRANCAMOS EL SERVIDOR PRIMERO (Para que Railway vea el puerto abierto rápido)
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
        });

        // 3. INTENTO DE CONEXIÓN A LA BASE DE DATOS
        console.log("Intentando conectar a la DB...");
        
        // Desactivar checks de FK temporalmente si vas a usar force:true
        // await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        
        await sequelize.authenticate();
        console.log("✅ Conexión establecida correctamente con MySQL");

        // Sincronización (usa { alter: true } si ya no quieres borrar datos)
        await sequelize.sync({ alter: true });
        console.log("✅ Tablas sincronizadas con éxito");
        
        // re-activar checks de FK
        // await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    } catch (error) {
        console.error("❌ Error en el proceso de arranque:", error.message);
        // NO usamos process.exit(1) para que el contenedor no se muera si falla la DB
    }
};

// 4. MANTENER EL EVENT LOOP OCUPADO (Keep-alive)
// Esto imprime un punto en la consola cada 5 minutos para que Railway vea actividad
setInterval(() => {
    console.log("... keep-alive ping ...");
}, 300000);

// 5. CAPTURA DE ERRORES CRÍTICOS (Para que no se caiga por errores tontos)
process.on('uncaughtException', (err) => {
    console.log('⚠️ Error no capturado (evitando cierre):', err.message);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('⚠️ Promesa no controlada (evitando cierre):', reason);
});

// Ejecutar el arranque
startServer();
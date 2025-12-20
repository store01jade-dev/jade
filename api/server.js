// Importamos la aplicacion Express que configuramos en app.js
import app from "./src/app.js";
//import { testConnection } from "./src/config/db.js";
import {sequelize} from "./src/models/index.js";

// Definimos el puerto en el que se ejecutara la API
// Si no existe en el .env, usamos 3000 por defecto

app.get('/', (req, res) => {
  res.status(200).send('Servidor Operativo');
});

/*async function startServer() {
  try {
    /*await sequelize.authenticate();
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
}*/

async function startServer() {
  // 1. Iniciamos el servidor PRIMERO que la base de datos
  const server = app.listen(process.env.PORT || 8080, '0.0.0.0', () => {
    console.log(`🚀 Servidor de EMERGENCIA activo en puerto: ${process.env.PORT || 8080}`);
  });

  try {
    console.log('Intentando conectar a DB...');
    await sequelize.authenticate();
    console.log('✅ DB Conectada');
    await sequelize.sync();
    console.log('✅ Tablas listas');
  } catch (error) {
    console.error('❌ La DB falló, pero el servidor seguirá prendido:', error.message);
  }
}

// Captura errores de promesas (como Sequelize fallando)
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ ERROR DE PROMESA NO CAPTURADO:', reason);
});

// Captura errores de código (variables inexistentes, etc)
process.on('uncaughtException', (err) => {
    console.error('❌ EXCEPCIÓN NO CAPTURADA:', err.message);
    console.error(err.stack);
});

startServer();
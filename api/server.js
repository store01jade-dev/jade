// Importamos la aplicacion Express que configuramos en app.js
import app from "./src/app.js";
//import { testConnection } from "./src/config/db.js";
import {sequelize} from "./src/models/index.js";

// Importamos dotenv para leer variables de entorno del archivo .env
import dotenv from "dotenv";

// Cargamos las variables de entorno
dotenv.config();

// Definimos el puerto en el que se ejecutara la API
// Si no existe en el .env, usamos 3000 por defecto
const PORT = process.env.PORT || 3000;

/* levantamos el servidor y escuchamos en el puerto definido
testConnection().then(() => {
    app.listen(PORT, ()=>{
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
});*/

/*const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida correctamente con MySQL");

    // solo en desarrollo usar sync({ alter: true }) 
    // en producción usar migraciones con Sequelize CLI
    await sequelize.sync({alter:true});
    console.log("Modelos sincronizados con éxito. Columnas añadidas/modificadas.")

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
};*/

/*async function repairDatabase() {
  try {
    console.log("Iniciando reparación manual de tablas...");
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
    
    // Borramos las tablas que están bloqueadas
    await sequelize.query('DROP TABLE IF EXISTS detalle_pedido;');
    await sequelize.query('DROP TABLE IF EXISTS variantes_productos;');
    
    // Creamos la tabla que MySQL dice que no encuentra
    await sequelize.query(`
      CREATE TABLE variantes_productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      ) ENGINE=InnoDB;
    `);
    
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log("Reparación completada. Ahora Sequelize puede continuar.");
  } catch (error) {
    console.error("Error en la reparación:", error);
  }
}*/

app.get('/', (req, res) => {
  res.status(200).send('Servidor Operativo');
});

async function startServer() {
  try {
    // LLAMAMOS A LA REPARACIÓN PRIMERO
    //await repairDatabase();

    await sequelize.authenticate();
    console.log('✅ Conexión a la DB establecida.');

    // Luego el sync normal
    await sequelize.sync();
    console.log('✅ Tablas sincronizadas.');
    
    console.log('Tablas sincronizadas correctamente.');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor activo en puerto: ${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar:', error);
    process.exit(1);
  }
}

startServer();
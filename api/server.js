// Importamos la aplicacion Express que configuramos en app.js
import app from "./src/app.js";
//import { testConnection } from "./src/config/db.js";
import sequelize from "./src/models/index.js";

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

async function startServer() {
  try {
    // 1. Desactivamos la revisión de llaves foráneas para evitar el error ER_FK_CANNOT_OPEN_PARENT
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    console.log('Revisión de FK desactivada temporalmente...');

    // 2. Sincronizamos (alter: true es más seguro para no borrar datos si luego agregas algo)
    await sequelize.sync({ alter: true });
    console.log('Tablas sincronizadas correctamente.');

    // 3. Volvemos a activar la revisión
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Revisión de FK reactivada.');

    app.listen(process.env.PORT || 3000, () => {
      console.log('Servidor corriendo en Railway');
    });
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

startServer();
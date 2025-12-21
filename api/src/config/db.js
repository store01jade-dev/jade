// Importamos  el ORM Sequelize en vez de utilizar la librería mysql2 con soporte para promesas ya que es mucho mas dinamico
import {Sequelize} from "sequelize";
// Importamos dotenv para poder usar variables de entorno desde el archivo .env
import dotenv from "dotenv";


// Cargamos las variables de entorno (DB_HOST, DB_USER, etc.)
dotenv.config();

// Forzamos la lectura directa de la variable de entorno del sistema
const databaseUrl = process.env.MYSQL_URL;

if (!databaseUrl) {
  console.error("❌ ERROR: La variable MYSQL_URL no está llegando al código.");
}

export const sequelize = new Sequelize(databaseUrl, {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    ssl: {
        require: true,
        rejectUnauthorized: false // Esto es VITAL para conexiones externas (Railway/Aiven)
    }
  },
  logging: false
});



export default sequelize;
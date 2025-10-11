// Importamos  el ORM Sequelize en vez de utilizar la librería mysql2 con soporte para promesas ya que es mucho mas dinamico
import {Sequelize} from "sequelize";
// Importamos dotenv para poder usar variables de entorno desde el archivo .env
import dotenv from "dotenv";


// Cargamos las variables de entorno (DB_HOST, DB_USER, etc.)
dotenv.config();

// Creamos la instancia de Sequlize para conectar a MySQL
// Seuqelize maneja el pool de conexiones automaticamente
const sequelize = new Sequelize(

    process.env.NAMEDB,           // Nombre de la base de datos           
    process.env.USERDB,           // Usuario de la BD
    process.env.PASSWORDDB,       // Contraseña del usuario
    {
        host: process.env.HOSTDB, // Dirección del servidor MySQL
        port: process.env.PORTDB, // Puerto de conexión (por defecto 3306)
        dialect: "mysql",         // Dialecto que se usara
        logging: false            // Desactiva logs SQL en consola
    }
       
);



/*Funcion para probar conexxion (Se puede hacer un llamado en server.js)
export const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Conexion establecida correctamente con MySQL");
    } catch (error) {
        console.error("Error de conexion a la BD: ", error);
    }
};

// Exportamos el pool para poder usarlo en cualquier parte del proyecto*/

export default sequelize;
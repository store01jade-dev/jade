// Importamos la librería mysql2 con soporte para Promesas
import mysql from "mysql2/promise";
// Importamos dotenv para poder usar variables de entorno desde el archivo .env
import dotenv from "dotenv";

// Cargamos las variables de entorno (DB_HOST, DB_USER, etc.)
dotenv.config();


// Creamos un pool de conexiones a MySQL
// 🔹 createPool maneja múltiples conexiones de manera eficiente
// 🔹 evita que tengamos que abrir/cerrar conexión manual en cada consulta
const pool = mysql.createPool({
    host: process.env.DB_HOST,           // Dirección del servidor de la BD
    user: process.env.DB_USER,           // Usuario de la BD
    password: process.env.DB_PASSWORD,   // Contraseña del usuario
    database: process.env.DB_NAME,       // Nombre de la base de datos
    port: process.env.DB_PORT,           // Puerto de conexión (por defecto 3306)
    waitForConnections: true,            // Espera en lugar de rechazar si no hay conexiones libres
    connectionLimit: 10,                 // Número máximo de conexiones simultáneas
    queueLimit: 0,                       // Número máximo de consultas en cola (0 = ilimitado)
});

// Exportamos el pool para poder usarlo en cualquier parte del proyecto
export default pool;
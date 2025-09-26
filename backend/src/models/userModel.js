import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

// Definir el modelo Usuario (mapea a la tabla de usuarios)
const Usuario = sequelize.define(
    "Usuario",
    {
        id: {
            type: DataTypes.INTEGER,         // Columna entera
            autoIncrement: true,             // Incrementa automaticamente
            primaryKey: true                 // Llave primaria
        },

        nombre: {
            type: DataTypes.STRING(100),      // VARCHAR(100)
            allowNull: false,                 // Campo obligatorio  
        },

        email: {
            type: DataTypes.STRING(150),      // VARCHAR(150)
            allowNull: false,
            unique: true                      // No puede repetirse
        },

        password_hash: {
            type: DataTypes.STRING(255),      // Contrasena encriptada
            allowNull: false
        },

        rol: {
            type: DataTypes.ENUM("cliente", "admin", "desarrollador"),  //ENUM en Mysql
            defaultValue: "Cliente"
        },

    },

    {
        tableName: "usuarios",   // Usar la tabla ya creada en MySQL
        timestamps: true,        // No usar createdAt/updatedAt automaticos
    }
);

export default Usuario;
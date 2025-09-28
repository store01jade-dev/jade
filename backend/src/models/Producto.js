import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import  Categoria  from "./Categoria.js";

//Definier el modelo de Producto
const Producto = sequelize.define(
    "Producto",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true, // llave primaria
        },

        nombre: {
            type: DataTypes.STRING(150), //nombre del produto
            allowNull: false,            // No puede esta vacio es requisito
        },

        descripcion: {
            type: DataTypes.TEXT,        // Descripcion larga
            allowNull: true,
        },

        precio: {
            type: DataTypes.DECIMAL(10, 2), // precio con dos decimales
            allowNull: true,
        },

        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
    },

    {
        tableName: "productos", // Nombre de la tabla en MySQL
        timestamps: true,       // Crear fechas automaticos 
    }
);

// Relacion: producto pertenece a una categoria
Producto.belongsTo(Categoria, {
    foreignKey: "Categoria_id",
    as: "categoria",
});

// Una categoira tiene muchos productos
Categoria.hasMany(Producto, {
    foreignKey: "categoria_id",
    as: "productos",
});


export default Producto;
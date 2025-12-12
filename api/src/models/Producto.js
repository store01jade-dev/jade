import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
//import  Categoria  from "./Categoria.js";

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

        precio_base: { // O simplemente 'precio'
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true, // Permitir NULL si solo se usa el precio de variante
            defaultValue: 0.00
        },

        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },

        //NUEVA COLUMNA: Rating (Calificación)
        rating: {
        type: DataTypes.FLOAT, // Usamos FLOAT para manejar valores como 4.5
        defaultValue: 0, 
        allowNull: false,
        },
    },

    {
        tableName: "productos", // Nombre de la tabla en MySQL
        timestamps: true,       // Crear fechas automaticos 
    }
);

export default Producto;

/* Relacion: producto pertenece a una categoria
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

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Producto = sequelize.define("Producto", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    precio: DataTypes.DECIMAL(10, 2),
    stock: DataTypes.INTEGER,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
}, {
    tableName: "productos",
    timestamps: true,
});

export default Producto;*/


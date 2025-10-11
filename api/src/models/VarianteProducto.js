import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
//import Producto from "./Producto.js";

const VarianteProducto = sequelize.define(
    "VarianteProducto",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        producto_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        sku: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },

        talla: {
            type: DataTypes.STRING(50),
            allowNull:true
        },

        color: {
            type: DataTypes.STRING(50),
            allowNull:true
        },

        stock: {
            type:DataTypes.INTEGER,
            defaultValue: 0
        },

        precio: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },

        /*peso: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        }*/
    },

    {
        tableName: "variantes_producto",
        timestamps: true
    }
);

export default VarianteProducto;

/*Producto.hasMany(VarianteProducto, {
    foreignKey: "producto_id",
    as: "variantes"
});

VarianteProducto.belongsTo(Producto,{
    foreignKey: "producto_id",
    as: "producto"
});

export default VarianteProducto;

// models/VarianteProducto.js
export default (sequelize, DataTypes) => {
  const VarianteProducto = sequelize.define(
    "VarianteProducto",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sku: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      talla: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      color: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      peso: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
    },
    {
      tableName: "variantes_producto",
      timestamps: true,
    }
  );
  return VarianteProducto;
}; */


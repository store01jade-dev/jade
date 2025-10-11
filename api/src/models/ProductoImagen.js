import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
//import Producto from "./Producto.js";
//import VarianteProducto from "./VariantesProducto.js";

const Productoimagen = sequelize.define(
    "ProdcutoImagen",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }, 

        producto_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        variante_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        url: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        principal: { 
          type: DataTypes.BOOLEAN,       // true = principal, false = no
          defaultValue: false,
        },

        sort_order: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
    },

    {
        tableName: "producto_imagen",
        timestamps: true
    }
);

export default Productoimagen;

/* Relaciones

Producto.hasMany(Productoimagen,{
    foreignKey: "producto_id",
    as: "imagenProducto"
});

Productoimagen.belongsTo(Producto, {
    foreignKey: "producto_id",
    as: "producto"
});

VarianteProducto.hasMany(Productoimagen,{
    foreignKey: "producto_id",
    as: "producto"
});

Productoimagen.belongsTo(VarianteProducto, {
    foreignKey: "variante_id",
    as: "variante"
});

export default Productoimagen;

// models/ProductoImagen.js
export default (sequelize, DataTypes) => {
  const ProductoImagen = sequelize.define(
    "ProductoImagen",
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

      variante_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // opcional, algunas imágenes pueden ser del producto general
      },

      url: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      sort_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

    },

    {
      tableName: "producto_imagen",
      timestamps: true,
    }

  );

  return ProductoImagen;
  
};*/


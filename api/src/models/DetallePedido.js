// src/models/DetallePedido.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
//import Pedido from "./Pedido.js";
import VarianteProducto from "./VarianteProducto.js";

const DetallePedido = sequelize.define(
    "DetallePedido", 
    {
        id: { 
            type: DataTypes.INTEGER, 
            autoIncrement: true, 
            primaryKey: true 
        },

        pedido_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },

        variantes_producto_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
            references: {
                model: 'variantes_productos',
                key: 'id'
            } 
        },

        cantidad: { 
            type: DataTypes.INTEGER,
            allowNull: false 
        },
        
        precio_unitario: { 
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: false 
        },

        subtotal: { 
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: false 
        },
    }, 
    {
        tableName: "detalle_pedido",
        timestamps: true
    }
);

export default DetallePedido;

/*Pedido.hasMany(DetallePedido, { 
    foreignKey: "pedido_id", 
    as: "detalles" 
});

DetallePedido.belongsTo(Pedido, { 
    foreignKey: "pedido_id", 
    as: "pedido" 
});

VarianteProducto.hasMany(DetallePedido, {
    foreignKey: "variantes_producto_id", 
    as: "detalles" 
});

DetallePedido.belongsTo(VarianteProducto, {
    foreignKey: "variantes_producto_id", 
    as: "variante" 
});

export default DetallePedido;

export default (sequelize, DataTypes) => {
  const DetallePedido = sequelize.define("DetallePedido", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    cantidad: DataTypes.INTEGER,
    precio_unitario: DataTypes.DECIMAL(10, 2),
    subtotal: DataTypes.DECIMAL(10, 2),
  }, {
    tableName: "detalle_pedido",
    timestamps: true,
  });

  return DetallePedido;
};*/


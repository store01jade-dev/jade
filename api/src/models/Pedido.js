// src/models/Pedido.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
//import Usuario from "./Usuario.js";
//import Direccion from "./Direccion.js";

const Pedido = sequelize.define(
    "Pedido", 
    {
        id: {
            type: DataTypes.INTEGER, 
            autoIncrement: true, 
            primaryKey: true 
        },

        usuario_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },

        direccion_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },

        pago_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true 
        },

        status: {
            type: DataTypes.ENUM("pendiente", "enviado", "entregado", "cancelado", "pagado"),
            defaultValue: "pendiente",
        },

        fecha_pedido: { 
            type: DataTypes.DATE, 
            defaultValue: DataTypes.NOW 
        },

        total: { 
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false 
        },
    },

    {
        tableName: "pedidos",
        timestamps: true
    }
);

export default Pedido;

/*Usuario.hasMany(Pedido, { 
    foreignKey: "usuario_id", 
    as: "pedidos" 
});

Pedido.belongsTo(Usuario, { 
    foreignKey: "usuario_id", 
    as: "usuario" 
});

Direccion.hasMany(Pedido, { 
    foreignKey: "direccion_id", 
    as: "pedidos" 
});

Pedido.belongsTo(Direccion, { 
    foreignKey: "direccion_id", 
    as: "direccion" 
});

export default Pedido;

export default (sequelize, DataTypes) => {
  const Pedido = sequelize.define("Pedido", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM("pendiente", "enviado", "entregado", "cancelado", "pagado"),
      defaultValue: "pendiente",
    },
    fecha_pedido: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    total: DataTypes.DECIMAL(10, 2),
  }, {
    tableName: "pedidos",
    timestamps: true,
  });

  return Pedido;
};*/


// src/models/Pago.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
//import Pedido from "./Pedido.js";

const Pago = sequelize.define(
    "Pago", 
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

        metodo_pago: { 
            type: DataTypes.STRING(50), 
            allowNull: false 
        }, // tarjeta, PayPal, PayU, Nequi

        transaccion_id: { 
            type: DataTypes.STRING(100), 
            allowNull: true 
        },

        monto_pagado: { 
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: false 
        },

        estado_pago: {
            type: DataTypes.ENUM("pendiente", "aprobado", "rechazado"),
            defaultValue: "pendiente",
        },

        respuesta_raw: { 
            type: DataTypes.TEXT, 
            allowNull: true 
        }, 
    },  

    {
        tableName: "pagos",
        timestamps: true
    }
);

export default Pago;

/*Pedido.hasOne(Pago, { 
    foreignKey: "pedido_id", 
    as: "pago" 
});

Pago.belongsTo(Pedido, {
    foreignKey: "pedido_id", 
    as: "pedido" 
});

export default Pago;

export default (sequelize, DataTypes) => {
  const Pago = sequelize.define("Pago", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    metodo_pago: {
      type: DataTypes.ENUM("tarjeta", "paypal", "payu", "nequi"),
      allowNull: false,
    },
    transaccion_id: DataTypes.STRING,
    monto_pagado: DataTypes.DECIMAL(10, 2),
    estado_pago: {
      type: DataTypes.ENUM("pendiente", "aprobado", "rechazado"),
      defaultValue: "pendiente",
    },
    respuesta_raw: DataTypes.JSON,
  }, {
    tableName: "pagos",
    timestamps: true,
  });

  return Pago;
};*/


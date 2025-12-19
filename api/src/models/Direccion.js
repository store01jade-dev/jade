import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
//import Usuario from "./Usuario.js";

const Direccion = sequelize.define(
    "Direccion",
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
        
        nombre_quien_recibe: {
            type: DataTypes.STRING(100),
            allowNull: false 
        },

        direccion: {
            type: DataTypes.STRING(255),
            allowNull: false 
        },
        
        ciudad: {
            type: DataTypes.STRING(100),
            allowNull: false 
        },
        
        telefono: {
            type: DataTypes.STRING(20),
            allowNull: true 
        },

        documento_identidad: { 
            type: DataTypes.STRING(20), 
            allowNull: false 
        },
        barrio: { 
            type: DataTypes.STRING(100), 
            allowNull: false 
        },
        referencias: { 
            type: DataTypes.TEXT, 
            allowNull: true 
        }
    }, 

    {
        tableName: "direccion",
        timestamps: true
    }
);

export default Direccion;

/*Usuario.hasMany(Direccion, {
    foreignKey: "usuario_id", 
    as: "direcciones" 
});

Direccion.belongsTo(Usuario, { 
    foreignKey: "usuario_id", 
    as: "usuario" 
});

export default Direccion;

export default (sequelize, DataTypes) => {
  const Direccion = sequelize.define("Direccion", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre_quien_recibe: DataTypes.STRING,
    direccion: DataTypes.STRING,
    ciudad: DataTypes.STRING,
    telefono: DataTypes.STRING,
  }, {
    tableName: "direccion",
    timestamps: true,
  });

  return Direccion;
};*/

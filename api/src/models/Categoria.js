import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

// Definimos el modelo de Categoria
const Categoria = sequelize.define(
    "Categoria",
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,          // para que se vaya incrementado auomaticamente 
            primaryKey: true              // es la llave primaria
        },

        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true                  //para que no sepita los nombres
        },

        imagen_url: {
            type: DataTypes.STRING(255),  //Para guardar la rura o URL de la imagen
            allowNull: true               //opcional
        },
    },

    {
        tableName: "categorias",          // debe concidir con la tabla creada en MySQL
        timestamps: true,                 // para que agrege fechas automaticamente
    }
);



export default Categoria;

/*export default (sequelize, DataTypes) => {
  const Categoria = sequelize.define("Categoria", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: DataTypes.STRING,
    imagen_url: DataTypes.STRING,
  }, {
    tableName: "categorias",
    timestamps: true,
  });

  return Categoria;
};*/

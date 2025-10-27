// models/Comment.js

import { DataTypes } from 'sequelize';
import  sequelize  from '../config/db.js';

const Comment = sequelize.define(
    "Comment", 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        // Nombre de la persona que deja el comentario
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // Contenido del comentario
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        // (Opcional) Fuente o fecha de creación (createdAt ya lo proporciona Sequelize)
        source: {
            type: DataTypes.STRING,
            defaultValue: 'Footer', 
        }
    }, 
    {
    // Nombre de la tabla
    tableName: 'comments' 
    }
);

// Nota: No necesita relaciones si solo se usa como testimonios genéricos.

export default Comment;
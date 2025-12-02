import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Definir el modelo Usuario (mapea a la tabla de usuarios)
const Usuario = sequelize.define(
    "Usuario",
    {
        id: {
            type: DataTypes.INTEGER,         // Columna entera
            autoIncrement: true,             // Incrementa automaticamente
            primaryKey: true                 // Llave primaria
        },

        nombre: {
            type: DataTypes.STRING(100),      // VARCHAR(100)
            allowNull: false,                 // Campo obligatorio  
        },

        email: {
            type: DataTypes.STRING(150),      // VARCHAR(150)
            allowNull: false,
            unique: true                      // No puede repetirse
        },

        password_hash: {
            type: DataTypes.STRING(255),      // Contrasena encriptada
            allowNull: false
        },

        rol: {
            type: DataTypes.ENUM("cliente", "admin", "desarrollador"),  //ENUM en Mysql
            defaultValue: "Cliente"
        },

        resetPasswordToken: {
          type: DataTypes.STRING,
          allowNull: true,
        },

        resetPasswordExpires: {
          type: DataTypes.DATE,
          allowNull: true,
        }

    },

    {
        tableName: "usuarios",   // Usar la tabla ya creada en MySQL
        timestamps: true,        // No usar createdAt/updatedAt automaticos

        hooks: {
            // Se ejecuta antes de crear un nuevo registro
            beforeCreate: async (usuario) => {
                // Si el campo 'password_hash' tiene un valor (en texto plano)
                if (usuario.password_hash) {
                    const salt = await bcrypt.genSalt(10); // Generar la sal
                    // Hashear el valor y asignarlo de vuelta
                    usuario.password_hash = await bcrypt.hash(usuario.password_hash, salt);
                }
            },
            // Opcional: Hook para actualizar, en caso de que un usuario cambie su clave
            beforeUpdate: async (usuario) => {
                 // Solo hashear si el campo 'password_hash' ha sido modificado
                if (usuario.changed('password_hash')) {
                    const salt = await bcrypt.genSalt(10);
                    usuario.password_hash = await bcrypt.hash(usuario.password_hash, salt);
                }
            }
        }
    }
);

// CREAR MÉTODO DE INSTANCIA para la comparación (lo usas en loginUser)
// Esto es opcional si ya usas bcrypt.compare directamente en el controlador, 
// pero mantiene la lógica de negocio en el modelo.
Usuario.prototype.comparePassword = async function(candidatePassword) {
    // Compara el texto plano con el hash guardado en la columna correcta
    return await bcrypt.compare(candidatePassword, this.password_hash);
};

// MÉTODO DE INSTANCIA para generar el token (lo llamamos desde el controlador)
Usuario.prototype.getResetPasswordToken = function() {
    // 1. Generar un token aleatorio y legible (usando crypto de Node.js)
    const resetToken = crypto.randomBytes(20).toString('hex');

    // 2. Hashear el token antes de guardarlo en la base de datos (seguridad)
    // Usamos el hash en la BD para evitar ataques de tiempo, pero el token sin hashear se envía por email
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // 3. Establecer la expiración (ejemplo: 1 hora)
    this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 60 minutos * 60 segundos * 1000 milisegundos

    // 4. Devolver el token EN TEXTO PLANO (el que se envía por email)
    return resetToken;
};

export default Usuario;



/*import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Usuario = sequelize.define("Usuario", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  contrasena: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "cliente",
  },
}, {
  tableName: "usuarios",
  timestamps: true,
});

export default Usuario;*/

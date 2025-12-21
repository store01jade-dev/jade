import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sequelize from "../config/db.js";
import Usuario from "../models/userModel.js";
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Registro de Usuario

export const registerUser = async (req, res) => {
    try {
        const {nombre, email, password, rol} = req.body;

        if(!nombre || !email || !password) {
            return res.status(400).json({error: "Todos los campos son obligatorios"});
        }

        const existingUser = await Usuario.findOne({ where: {email} });
        if(existingUser){
            return res.status(400).json({ error: "El email ya esta registrado" });
        }

        // CAMBIO AQUÍ: No uses bcrypt.hash en el controlador. 
        // Pasa la contraseña plana y el HOOK del modelo se encargará.
        const newUser = await Usuario.create({
            nombre,
            email,
            password_hash: password, // El hook 'beforeCreate' la encriptará una sola vez
            rol
        });

        res.status(201).json({
            message: "Usuario registrado exitosamente",
            userId: newUser.id
        });
    } catch (error) {
        console.error(" Error en usuarioRegistrado: ", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //console.log(req.body);

        // validar que los campos no esten vacios
        if(!email || !password) {
            return res.status(400).json({ error: "Credenciales invalidas" });
        }

        // Buscar usuario en BD
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
        }

        //comparar contrasena ingresada con la guardada en la DB
        const isMatch = await bcrypt.compare(password, usuario.password_hash);
        if(!isMatch){
            return res.status(401).json({ error: "Credenciales invalidas" });
        }

        // Obtener los datos planos del usuario
        const userData = usuario.toJSON(); // <-- ¡CRÍTICO: Convierte la instancia a un objeto JS plano!
        //console.log("Datos del usuario para firmar JWT:", userData); 

        //Crear token JWT para autenticacion 
        const token = jwt.sign(
            { id: userData.id, rol: userData.rol }, // Payload
            process.env.JWTSECRET || "Secreto dev", // Clave secreta
            { expiresIn: "1h" }  //tiempo en el que expira
        );

        //res.json({ mesaage: "Login existoso", token});
        return res.status(200).json({ token });
    } catch (error) {
        console.error("Error en LoginUser: ", error);
        res.status(500).json({ error: "Errror en el servidor"});
    }
};

// listar todos los usuarios

export const listUsers = async (req, res) =>{
    try {
        // Solo devolver datos basicos, nunca contrasenas
        const users = await Usuario.findAll({
            attributes: ["id", "nombre", "email", "rol", "createdAt", "updatedAt" ]
        });
        res.json(users);
    } catch (error) {
        console.error("Error en ListUsers: ", error);
        res.status(500).json({error: "Error en el servidor" });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { rol } = req.body; // El nuevo rol que viene del frontend

        // 1. Validar que el rol sea uno de los permitidos
        const rolesPermitidos = ['user', 'admin', 'dev'];
        if (!rolesPermitidos.includes(rol)) {
            return res.status(400).json({ error: "Rol no válido" });
        }

        // 2. Buscar y actualizar
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        usuario.rol = rol;
        await usuario.save();

        res.json({ message: "Rol actualizado correctamente", usuario });
    } catch (error) {
        console.error("Error en updateUserRole: ", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};

// Controlador para solicitar el enlace de restablecimiento (Parte A)
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    let usuario;

    try {
        usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            // No revelamos si el correo existe por seguridad.
            // Siempre respondemos con éxito para evitar enumeración de usuarios.
            return res.status(200).json({ message: "Si el correo existe, se ha enviado un enlace." });
        }

        // 1. Generar el token (esto también lo guarda y establece la expiración en la BD)
        const resetToken = usuario.getResetPasswordToken();

        // 2. Guardar los cambios del token en la BD (el hook no se aplica aquí)
        await usuario.save({ validate: false }); // Usamos validate: false para omitir validaciones que podrían fallar

        // 3. Configurar el servicio de email (ejemplo con Nodemailer)
        const transporter = nodemailer.createTransport({
            // Aquí van tus credenciales de servicio (Gmail, SendGrid, etc.)
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS, 
            },
        });

        // 4. Crear el enlace que irá en el email (asumiendo que tu frontend corre en :3000)
        const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
        
        const message = `Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace: \n\n ${resetURL} \n\n Si no solicitaste esto, ignora este correo. Este enlace expira en una hora.`;

        const mailOptions = {
            to: usuario.email,
            from: process.env.EMAIL_FROM || 'tu_email@ejemplo.com',
            subject: 'Restablecimiento de Contraseña',
            text: message,
        };

        // 5. Enviar el email
        await transporter.sendMail(mailOptions);
        
        res.status(200).json({ success: true, message: 'Enlace de restablecimiento enviado al correo.' });

    } catch (error) {
        console.error("Error en forgotPassword:", error);
        // CORRECCIÓN: Solo intenta limpiar el token si 'usuario' fue encontrado
        // y se definió antes del error (o maneja la referencia si quieres limpiarlo).
        if (usuario) { 
             // Intenta limpiar el token si el error ocurrió DESPUÉS de encontrar el usuario,
             // por ejemplo, si el error fue en transporter.sendMail().
             usuario.resetPasswordToken = undefined;
             usuario.resetPasswordExpires = undefined;
             await usuario.save({ validate: false });
        }

        res.status(500).json({ error: "Error en el servidor al procesar la solicitud." });
    }
};

// Controlador para aplicar la nueva contraseña (Parte C del Backend)
export const resetPassword = async (req, res) => {
    // 1. Obtener el token de la URL y la nueva contraseña del cuerpo
    const token = req.params.token;
    const { password } = req.body; 

    // 2. Hashear el token de la URL para compararlo con el valor hasheado en la BD
    const resetPasswordTokenHash = crypto
        .createHash('sha256')
        .update(token) // Usamos el token plano recibido por URL
        .digest('hex');

    try {
        // 3. Buscar al usuario por el token y verificar que no haya expirado
        const usuario = await Usuario.findOne({ 
            where: { 
                resetPasswordToken: resetPasswordTokenHash,
                // El campo resetPasswordExpires debe ser mayor al tiempo actual
                resetPasswordExpires: { [sequelize.Sequelize.Op.gt]: Date.now() } 
            } 
        });

        if (!usuario) {
            return res.status(400).json({ error: "El token es inválido o ha expirado." });
        }

        // 4. Validar la nueva contraseña
        if (!password || password.length < 6) {
            return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres." });
        }

        // 5. Aplicar la nueva contraseña (en texto plano)
        // El hook 'beforeUpdate' de Sequelize (que definimos antes) se encargará de hashearla
        usuario.password_hash = password;

        // 6. Limpiar los campos del token para invalidar el enlace
        usuario.resetPasswordToken = null;
        usuario.resetPasswordExpires = null;

        // 7. Guardar el usuario (esto dispara el hook de hashing)
        await usuario.save(); 

        // Opcional: Enviar un email de confirmación
        // ... (Lógica de email de confirmación) ...

        res.status(200).json({ success: true, message: "Contraseña restablecida con éxito. Puedes iniciar sesión." });

    } catch (error) {
        console.error("Error en resetPassword:", error);
        res.status(500).json({ error: "Error en el servidor al restablecer la contraseña." });
    }
};
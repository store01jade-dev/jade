import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "../models/userModel.js";

// Registro de Usuario

export const registerUser = async (req, res) => {
    try {
        const {nombre, email, password, rol} = req.body;

        // Validamos campos requeridos
        if(!nombre || !email || !password) {
            return res.status(400).json({error: "Todos los campos son obligatorios"});
        }

        // Verificar si el email ya existe
        const registerUser = await Usuario.findOne({ where: {email} });
        if(registerUser){
            return res.status(400).json({ error: "El email ya esta registrado" });
        }

        //Encriptar la contrasena
        const passwordHash = await bcrypt.hash(password, 10);

        //Crear nuevo usuario en la base de datos
        const newUser = await Usuario.create({
            nombre,
            email,
            password_hash: passwordHash,
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


// Login de usuario
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

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
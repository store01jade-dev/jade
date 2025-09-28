import jwt from "jsonwebtoken";

// Middleware para autenticar usuarios mediante JWT
export const authMiddleware = (req, res, next) => {
    try {
        //Verificar que el cliente envia el token en los headers
        const authHeader = req.headers["authorization"];
        if(!authHeader){
            return res.status(401).json({ message:"Token no proporcionado"});
        }

        // El token normalmente viene como "Bearer <token>, asi que lo separamos"
        const token = authHeader.split(" ")[1];

        //Validar el token con la clave secreta
        const decoded = jwt.verify(
            token,
            process.env.JWTSECRET || "Secreto dev"
        );

        //Guarddar la informacaion del token en req.user para usarla despues
        req.user = decoded;
        // decoded contiene lo que pusimos en el payload: {id, rol}
        // Continuar hacia el controlador si todo salio bien
        next();

    } catch (error) {
        console.error("error en authMiddleware: ", error);
        return res.status(401).json({ message: "Token invalido o expirado" });
    }
}
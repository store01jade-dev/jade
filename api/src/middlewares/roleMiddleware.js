// Middleware para validar si el usuario tiene el rol permitido
export const authorizeRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        try {
            // Verificar que el usuario haya pasado por el authMiddleware
            if(!req.user){
                return res.status(401).json({ message: "No autenticado" });
            }

            // Revisamos si el rol del usuario esta dentro de los rolesPermitidos
            if(!rolesPermitidos.includes(req.user.rol)) {
                return res.status(403).json({ message: "Acceso denegado: rol no utorizado"});
            }

            //Si todo va bien, dejamos pasar al controlador
            next();
        } catch (error) {
            console.error("Error en roleMiddleware: ", error);
            return res.status(500).json({ message: "Error interno en autorizacion" });
        }
    };
};
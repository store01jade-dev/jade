import { Router } from "express";
import { registerUser, loginUser, listUsers, forgotPassword, resetPassword } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";


const router = Router();

// Definimos endpoints

// Rutas publicas
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/password/forgot", forgotPassword);
router.patch("/password/reset/:token", resetPassword);

// Rutas con auth
router.get("/users",
    authMiddleware,
    authorizeRoles("admin", "dev"),
    listUsers
);


export default router;
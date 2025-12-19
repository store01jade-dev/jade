import { Router } from "express";
import { registerUser, loginUser, listUsers, forgotPassword, resetPassword, updateUserRole } from "../controllers/userController.js";
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
router.get("/", authMiddleware, authorizeRoles("admin", "dev"), listUsers);
router.patch("/:id/role", authMiddleware, authorizeRoles("admin", "dev"), updateUserRole);


export default router;
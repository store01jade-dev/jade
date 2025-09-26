import { Router } from "express";
import { registerUser, loginUser, listUsers } from "../controllers/userController.js";

const router = Router();

// Definimos endpoints
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", listUsers);


export default router;
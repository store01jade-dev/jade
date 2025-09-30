/*import { Router } from "express";
import {
    createVariante,
    getVarianteById,
    getVariantes,
    updateVariante,
    deleteVariante,
} from "../controllers/varianteProductoCrontroller.js";

const router = Router();

router.post("/", createVariante);
router.get("/", getVariantes);
router.get("/:id", getVarianteById);
router.put("/:id", updateVariante);
router.delete("/:id", deleteVariante);

export default router;*/

// src/routes/varianteRoutes.js

import express from "express";
import {
  listarVariantes,
  obtenerVariante,
  crearVariante,
  actualizarVariante,
  eliminarVariante,
} from "../controllers/varianteProductoCrontroller.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Rutas públicas
router.get("/", listarVariantes);
router.get("/:id", obtenerVariante);

// Rutas protegidas (solo admin/dev pueden modificarlas)
router.post("/", authMiddleware, authorizeRoles("admin", "dev"), crearVariante);
router.put("/:id", authMiddleware, authorizeRoles("admin", "dev"), actualizarVariante);
router.delete("/:id", authMiddleware, authorizeRoles("admin", "dev"), eliminarVariante);

export default router;



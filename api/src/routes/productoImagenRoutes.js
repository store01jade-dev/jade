/*import { Router } from "express";
import {
    createImagen,
    getImagenes,
    getImagenById,
    updateImagen,
    deleteImagen
} from "../controllers/varianteImagenController.js";

const router = Router();

router.post("/", createImagen);
router.get("/", getImagenes);
router.get("/:id", getImagenById);
router.put("/:id", updateImagen);
router.delete("/:id", deleteImagen);

export default router;*/

import express from "express";
import {
  listarImagenes,
  obtenerImagen,
  crearImagen,
  actualizarImagen,
  eliminarImagen,
} from "../controllers/varianteImagenController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Rutas públicas
router.get("/", listarImagenes);
router.get("/:id", obtenerImagen);

// Rutas protegidas (solo admin/dev pueden modificarlas)
router.post("/", authMiddleware, authorizeRoles("admin", "dev"), crearImagen);
router.put("/:id", authMiddleware, authorizeRoles("admin", "dev"), actualizarImagen);
router.delete("/:id", authMiddleware, authorizeRoles("admin", "dev"), eliminarImagen);

export default router;



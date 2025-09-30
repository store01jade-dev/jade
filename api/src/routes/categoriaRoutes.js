/*import { Router } from 'express';


import {
    crearCategoria,
    listarCategorias,
    obtenerCategoria,
    actualizarCategoria,
    eliminarCategoria,
} from "../controllers/categoriaController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = Router();

// listar categorias (publico)
router.get("/", listarCategorias);
// obtener una categoria especifica
router.get("/:id", obtenerCategoria);

// Crear categoria (solo admin o dev)
router.post("/", authMiddleware, authorizeRoles("admin", "dev"), crearCategoria);

//Actualizar categoria (solo admin o dev)
router.put("/:id", authMiddleware, authorizeRoles("admin", "dev"), actualizarCategoria);

// eliminar categorias (solo admin o dev)
router.delete("/:id", authMiddleware, authorizeRoles("admin", "dev"), eliminarCategoria);


export default router;*/

import { Router } from "express";
import {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../controllers/categoriaController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = Router();

// ✅ Público: cualquier usuario puede ver categorías
router.get("/", getCategorias);
router.get("/:id", getCategoriaById);

// 🔒 Protegido: solo admin puede crear, editar o borrar
router.post("/", authMiddleware, authorizeRoles("admin"), createCategoria);
router.put("/:id", authMiddleware, authorizeRoles("admin"), updateCategoria);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteCategoria);

export default router;

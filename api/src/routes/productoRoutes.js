/*import { Router } from "express";
import {
    createProducto,
    listProductos,
    getProducto,
    updateProducto,
    deleteProducto,
} from "../controllers/productoController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = Router();

//publico 
// listar produtos 
router.get("/", listProductos);
// obtener un producto por ID
router.get("/:id", getProducto);

// Privado 
// Crear un Producto
router.post("/", authMiddleware, authorizeRoles("admin", "dev"), createProducto);

// Actualizar porducto 
router.put("/:id", authMiddleware, authorizeRoles("admin", "dev"), updateProducto);

// Eliminar producto
router.delete("/:id", authMiddleware, authorizeRoles("admin", "dev"), deleteProducto);

export default router; */

import express from "express";
import {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/productoController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import upload from "../middlewares/upload.js"

const router = express.Router();

// Rutas públicas
router.get("/", listarProductos);
router.get("/:id", obtenerProducto);

// Rutas protegidas (solo admin o dev pueden modificar productos)
router.post("/", authMiddleware, authorizeRoles("admin", "dev"), upload, crearProducto);
router.put("/:id", authMiddleware, authorizeRoles("admin", "dev"), actualizarProducto);
router.delete("/:id", authMiddleware, authorizeRoles("admin", "dev"), eliminarProducto);

export default router;

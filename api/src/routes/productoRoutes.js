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
  getNewProducts,
  getTrendingProducts,
  voteProduct,
  getCatalogProducts,
} from "../controllers/productoController.js";


import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import  multerInstance  from "../middlewares/upload.js"

const router = express.Router();

// Rutas públicas

// obtnener la lista de productos
router.get("/", listarProductos);
// Novedades (Ordenados por fecha descendente, limitado)
router.get('/new', getNewProducts); 
// ruta para Tendencias
router.get('/trending', getTrendingProducts); 
// Seccion catalogo pag inicial
router.get('/catalog-featured', getCatalogProducts);
//Entrar al detalle del producto
//Nueva ruta para votar/contar "Me Gusta"
router.patch('/vote/:id', voteProduct); // Usamos PATCH para actualizar parcialmente
router.get("/:id", multerInstance.array('images', 10), obtenerProducto);


// Rutas protegidas (solo admin o dev pueden modificar productos)
router.post("/", authMiddleware, authorizeRoles("admin", "dev"), multerInstance.array('images', 10), crearProducto);
router.put("/:id", authMiddleware, authorizeRoles("admin", "dev"), multerInstance.array('images', 10), actualizarProducto);
router.delete("/:id", authMiddleware, authorizeRoles("admin", "dev"), eliminarProducto);

export default router;

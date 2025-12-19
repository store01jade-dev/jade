// src/routes/orderRoutes.js
import express from 'express';
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus, getOrderById } from '../controllers/pedidoController.js';
// Importa tu middleware de autenticación (el que verifica el JWT)
import { authMiddleware, restrictTo } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

// --- RUTAS PÚBLICAS/AUTENTICADAS (Clientes) ---

// Crear un pedido (POST /api/v1/orders)
router.post('/', authMiddleware, createOrder);

// Ver mis pedidos (GET /api/v1/orders/mis-pedidos)
router.get('/mis-pedidos', authMiddleware, getMyOrders);
router.get('/mis-pedidos/:id', authMiddleware, getOrderById);


// --- RUTAS ADMINISTRATIVAS (Solo Admin) ---

// Ver todos los pedidos de la tienda (GET /api/v1/orders/admin/all)
router.get('/admin/all', authMiddleware, restrictTo('admin'), getAllOrders);

// Actualizar estado del pedido (PATCH /api/v1/orders/:id/status)
router.patch('/:id/status', authMiddleware, restrictTo('admin'), updateOrderStatus);

export default router;
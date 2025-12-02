// src/routes/orderRoutes.js
import express from 'express';
import { createOrder } from '../controllers/pedidoController.js';
// Importa tu middleware de autenticación (el que verifica el JWT)
// import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Ruta: POST /api/v1/orders
// Requiere autenticación para saber qué usuario está comprando
router.post('/orders', /* protect, */ createOrder); // Descomentar 'protect' cuando lo tengas

export default router;
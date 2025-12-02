// src/controllers/orderController.js
import Pedido from '../models/Pedido.js';
import DetallePedido from '../models/DetallePedido.js';
import Direccion from '../models/Direccion.js';
import VarianteProducto from '../models/VarianteProducto.js'; // 📌 ¡MODELO DE STOCK!
import sequelize from '../config/db.js'; // Para la transacción
import asyncHandler from 'express-async-handler'; // Para manejar errores asíncronos

// Controlador para crear un nuevo pedido
export const createOrder = asyncHandler(async (req, res) => {
    
    // Asumimos que el middleware 'protect' ha adjuntado el usuario:
    const userId = req.user.id; 
    
    // Los datos provienen del frontend (CheckoutPage)
    const { 
        items, // Array de { productoId, cantidad, precioUnitario }
        direccionEnvio, 
        total, 
        metodoPago 
    } = req.body;

    // 1. Validaciones iniciales
    if (!items || items.length === 0 || !direccionEnvio || !total) {
        res.status(400);
        throw new Error("Faltan datos requeridos para crear el pedido.");
    }

    // 2. Usaremos una transacción para asegurar la atomicidad de la operación
    const transaction = await sequelize.transaction();

    try {
        // 3. Crear la Dirección de Envío
        const nuevaDireccion = await Direccion.create({
            usuario_id: userId,
            nombre_quien_recibe: direccionEnvio.nombreCompleto, 
            direccion: direccionEnvio.direccion,
            ciudad: direccionEnvio.ciudad,
            telefono: direccionEnvio.telefono,
            // Aquí puedes añadir codigo_postal si lo incluyes en tu modelo Direccion
        }, { transaction });


        // 4. Crear el Pedido principal
        const nuevoPedido = await Pedido.create({
            usuario_id: userId,
            direccion_id: nuevaDireccion.id,
            pago_id: null, 
            status: 'pendiente', 
            total: total,
        }, { transaction });
        

        // 5. 🛒 REDUCCIÓN DE INVENTARIO Y CREACIÓN DE DETALLES (CRÍTICO)
        const detallesPromises = items.map(async (item) => {
            
            // 5a. Buscar la variante del producto y bloquearla dentro de la transacción
            const variante = await VarianteProducto.findByPk(item.productoId, { transaction });

            if (!variante) {
                // Si la variante no existe (por un error en el ID), abortar
                throw new Error(`Variante de producto no encontrada (ID: ${item.productoId}).`);
            }
            
            // 5b. Verificar Stock
            const currentStock = variante.stock;
            const requiredQuantity = item.cantidad;

            if (currentStock < requiredQuantity) {
                // Si falla el stock, se lanza un error y se revierte
                throw new Error(`Stock insuficiente para variante ID ${item.productoId}. Solicitado: ${requiredQuantity}, Disponible: ${currentStock}.`);
            }

            // 5c. Reducir el stock y actualizar el registro
            variante.stock = currentStock - requiredQuantity;
            await variante.save({ transaction });

            // 5d. Devolver la data para crear el Detalle del Pedido
            return {
                pedido_id: nuevoPedido.id,
                variantes_producto_id: item.productoId,
                cantidad: requiredQuantity,
                precio_unitario: item.precioUnitario,
                subtotal: item.precioUnitario * requiredQuantity,
            };
        });

        // Esperar a que toda la lógica de stock y detalles se resuelva
        const detalles = await Promise.all(detallesPromises);
        
        // 6. Crear todos los detalles del pedido de golpe
        await DetallePedido.bulkCreate(detalles, { transaction });


        // 7. Confirmar la transacción: Si llegamos aquí, todo es exitoso
        await transaction.commit();

        // 8. Respuesta de éxito
        return res.status(201).json({ 
            message: "Pedido creado con éxito.", 
            pedidoId: nuevoPedido.id 
        });

    } catch (error) {
        // Si algo falla, deshacer todos los cambios (dirección, pedido, stock)
        await transaction.rollback(); 
        console.error("Error al crear el pedido, transacción revertida:", error);

        // Devolvemos un error 400 si es un problema de stock, o 500 para otros errores
        const statusCode = error.message.includes('Stock insuficiente') ? 400 : 500;
        res.status(statusCode).json({ 
            error: error.message || "Error en el servidor al procesar el pedido." 
        });
    }
});
// src/controllers/orderController.js
import Usuario from '../models/userModel.js';
import Producto from '../models/Producto.js';
import Pedido from '../models/Pedido.js';
import DetallePedido from '../models/DetallePedido.js';
import Direccion from '../models/Direccion.js';
import VarianteProducto from '../models/VarianteProducto.js'; // 📌 ¡MODELO DE STOCK!
import sequelize from '../config/db.js'; // Para la transacción
import asyncHandler from 'express-async-handler'; // Para manejar errores asíncronos
import { sendAdminOrderNotification } from '../utils/email.js';

/* Controlador para crear un nuevo pedido
export const createOrder = asyncHandler(async (req, res) => {
    
    // Asumimos que el middleware 'protect' ha adjuntado el usuario:
    const userId = req.user.id; 
    
    // Los datos provienen del frontend (CheckoutPage)
    const { 
        items, // Array de { productoId, cantidad, precioUnitario }
        envio, 
        total, 
        metodoPago 
    } = req.body;

    // 1. Validaciones iniciales
    if (!items || items.length === 0 || !envio || !total) {
        res.status(400);
        throw new Error("Faltan datos requeridos para crear el pedido.");
    }

    // 2. Usaremos una transacción para asegurar la atomicidad de la operación
    const transaction = await sequelize.transaction();

    try {
        // 3. Crear la Dirección de Envío
        const nuevaDireccion = await Direccion.create({
            usuario_id: userId,
            nombre_quien_recibe: envio.nombre_receptor, 
            direccion: envio.direccion,
            ciudad: envio.ciudad,
            telefono: envio.telefono,
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

            console.log("Datos recibidos del item:", item);
            
            // 5a. Buscar la variante del producto y bloquearla dentro de la transacción
            const variante = await VarianteProducto.findByPk(item.producto_id, { transaction });

            if (!variante) {
                // Si la variante no existe (por un error en el ID), abortar
                throw new Error(`Variante de producto no encontrada (ID: ${item.producto_id}).`);
            }

            const cantidad = Number(item.cantidad);
            const precio = Number(item.precio_unitario); 

            if (isNaN(precio) || isNaN(cantidad || precio <= 0)) {
                throw new Error(`Error en los cálculos: precio(${item.precio_unitario}) o cantidad(${item.cantidad}) inválidos para el producto ${item.producto_id}`);
            }
            
            // 5b. Verificar Stock
            const currentStock = variante.stock;
            const requiredQuantity = item.cantidad;

            if (currentStock < requiredQuantity) {
                // Si falla el stock, se lanza un error y se revierte
                throw new Error(`Stock insuficiente para variante ID ${item.producto_id}. Solicitado: ${requiredQuantity}, Disponible: ${currentStock}.`);
            }

            // 5c. Reducir el stock y actualizar el registro
            variante.stock = currentStock - requiredQuantity;
            await variante.save({ transaction });

            // 5d. Devolver la data para crear el Detalle del Pedido
            return {
                pedido_id: nuevoPedido.id,
                variantes_producto_id: item.producto_id,
                cantidad: requiredQuantity,
                precio_unitario: precio,
                subtotal: precio * cantidad,
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
});*/

export const createOrder = asyncHandler(async (req, res) => {
    const userId = req.user.id; 
    const { items, envio, total, metodoPago } = req.body;

    //console.log("DATOS DE ENVIO RECIBIDOS:", envio);

    if (!items || items.length === 0 || !envio || !total) {
        res.status(400);
        throw new Error("Faltan datos requeridos para crear el pedido.");
    }

    const transaction = await sequelize.transaction();

    try {
        // 1. Crear la Dirección con los nuevos campos del CheckoutForm
        const nuevaDireccion = await Direccion.create({
            usuario_id: userId,
            nombre_quien_recibe: envio.nombreCompleto, // Mapeado del Form
            documento_identidad: envio.documentoIdentidad,// 🚩 Nuevo
            direccion: envio.direccion,
            ciudad: envio.ciudad,
            barrio: envio.barrio, // 🚩 Nuevo
            telefono: envio.telefono,
            referencias: envio.notas // Las notas van a referencias en DB
        }, { transaction });

        // 2. Crear el Pedido incluyendo el método de pago
        const nuevoPedido = await Pedido.create({
            usuario_id: userId,
            direccion_id: nuevaDireccion.id,
            status: 'pendiente', 
            total: total,
            metodo_pago: req.body.metodo_pago, // 🚩 Ahora se guarda el método
        }, { transaction });

        // 3. Lógica de Inventario y Detalles
        const detallesPromises = items.map(async (item) => {
            const variante = await VarianteProducto.findByPk(item.producto_id, { transaction });

            if (!variante) throw new Error(`Producto no encontrado (ID: ${item.producto_id}).`);

            const cantidad = Number(item.cantidad);
            const precio = Number(item.precio_unitario);

            if (variante.stock < cantidad) {
                throw new Error(`Stock insuficiente para ${variante.nombre}. Disponible: ${variante.stock}`);
            }

            // Descontar Stock
            variante.stock -= cantidad;
            await variante.save({ transaction });

            return {
                pedido_id: nuevoPedido.id,
                variantes_producto_id: item.producto_id,
                cantidad: cantidad,
                precio_unitario: precio,
                subtotal: precio * cantidad,
            };
        });

        const detalles = await Promise.all(detallesPromises);
        await DetallePedido.bulkCreate(detalles, { transaction });

        // 4. COMMIT de la transacción
        await transaction.commit();

        // 5. ENVIAR CORREO (Se hace DESPUÉS del commit y ANTES del res.json)
        try {
            await sendAdminOrderNotification(nuevoPedido, nuevaDireccion, req.user);
            console.log("Correo enviado al administrador");
        } catch (mailError) {
            console.error("Error al enviar el correo, pero el pedido se creó:", mailError);
            // No lanzamos error aquí para no frustrar la compra si el mail falla
        }

        // 6. RESPUESTA FINAL (El return siempre al final)
        return res.status(201).json({ 
            message: "Pedido creado con éxito.", 
            pedidoId: nuevoPedido.id 
        });

    } catch (error) {
        if (transaction) await transaction.rollback(); 
        console.error("Error en createOrder:", error);
        res.status(400).json({ error: error.message });
    }
});

// src/controllers/pedidoController.js
export const getMyOrders = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.rol; // Asumiendo que guardas el rol en el token

    let pedidos;

    if (userRole === 'admin') {
        // El admin ve TODOS los pedidos con los datos del usuario que compró
        pedidos = await Pedido.findAll({
            include: [{ model: Usuario, attributes: ['nombre', 'email'] }],
            order: [['createdAt', 'DESC']]
        });
    } else {
        // El cliente solo ve los SUYOS
        pedidos = await Pedido.findAll({
            where: { usuario_id: userId },
            order: [['createdAt', 'DESC']]
        });
    }

    res.json(pedidos);
});

// Obtener TODOS los pedidos con los datos del cliente
export const getAllOrders = asyncHandler(async (req, res) => {
    const pedidos = await Pedido.findAll({
        include: [
            { model: Usuario, as: "usuario", attributes: ['nombre', 'email'] },
            { model: Direccion, as: "direccion" } // 🚩 Traemos los datos del CheckoutForm
        ],
        order: [['createdAt', 'DESC']]
    });
    res.json(pedidos);
});

// Cambiar el estado de un pedido (Ej: de Pendiente a Enviado)
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const pedido = await Pedido.findByPk(req.params.id);

    if (!pedido) {
        return res.status(404).json({ message: "Pedido no encontrado" });
    }

    pedido.status = status;
    await pedido.save();

    res.json({ message: "Estado actualizado", pedido });
});

export const getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const pedido = await Pedido.findByPk(id, {
        include: [
            { 
                model: Direccion,
                as: 'direccion'
            },

            { 
                model: DetallePedido,
                as: 'detalles',
                include: [{ 
                    model: VarianteProducto,
                    as: 'variante',
                    include: [{
                        model: Producto,
                        as: 'producto'
                    }]
                }] // Para ver nombre, talla y color
            }
        ]
    });

    if (!pedido) {
        return res.status(404).json({ message: "Pedido no encontrado" });
    }

    // Opcional: Verificar que el pedido pertenezca al usuario que consulta
    if (pedido.usuario_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: "No tienes permiso para ver este pedido" });
    }

    res.json(pedido);
});
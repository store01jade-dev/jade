// Función auxiliar para transformar los archivos de Multer en objetos listos para Sequelize
const subirImagenesSimuladas = (files) => {
    // 1. Obtiene los archivos que Multer ha colocado en req.files
    // 2. Transforma cada archivo en un objeto con el formato de la DB
    return files.map((file, index) => ({
        // Usamos una URL simulada basada en el nombre original
        // Esto asume que estás simulando la subida a un servicio externo
        url: `/uploads/${file.originalname.replace(/\s/g, '_')}-${Date.now()}_${index}`,
        principal: index === 0, // La primera imagen es la principal
        sort_order: index,
    }));
};

import { Op } from "sequelize";
import {
  Producto,
  Categoria,
  VarianteProducto,
  ProductoImagen,
  sequelize
} from "../models/index.js";

/* Listar todos los productos con categorías, variantes e imágenes
export const listarProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: [
        { model: Categoria,
          as: "categoria",
          attributes: ["id", "nombre"] 
        },

        {
          model: VarianteProducto,
          as: "variantes",
          attributes: ["id", "color", "talla", "precio", "stock"],
          include: [
            { 
              model: ProductoImagen, 
              as: "imagenesVariante",
              where: {principal: true}, // solo traer la imagen principal
              required: false,          // permite variantes sin imagenes
              attributes: ["id", "url", "principal"] 
            }
          ],
        },
      ],
    });

    res.json(productos);
  } catch (error) {
    console.error("Error al listar productos:", error);
    res.status(500).json({ error: "Error interno al listar productos" });
  }
};*/

// Listar todos los productos con categorías, variantes e imágenes (con filtros)
export const listarProductos = async (req, res) => {
    // 1. Leer los parámetros de la URL
    const { nombre, categoria_id, precioMin, precioMax } = req.query;

    // Objeto base para las condiciones WHERE de la tabla Producto
    const whereProducto = {}; 
    
    // 2. Filtro por Nombre (búsqueda parcial, case-insensitive)
    if (nombre) {
        // Usar [Op.like] para buscar coincidencias parciales
        whereProducto.nombre = { [Op.like]: `%${nombre}%` };
    }

    // 3. Filtro por Categoría
    if (categoria_id) {
        whereProducto.categoria_id = categoria_id;
    }
    
    // 4. Filtro por Precio (Asumiendo que el campo 'precio' es el precio base en la tabla Producto)
    // NOTA: Si solo quieres filtrar por precios de variantes, esta lógica debe ser más compleja.
    if (precioMin || precioMax) {
        // Usar precio_base en lugar de precio
        whereProducto.precio_base = {}; 
        
        // Aseguramos que se envíe el filtro solo si el valor existe
        if (precioMin) {
            // Mayor o igual ( >= )
            whereProducto.precio_base[Op.gte] = parseFloat(precioMin); 
        }
        
        if (precioMax) {
            // Menor o igual ( <= )
            whereProducto.precio_base[Op.lte] = parseFloat(precioMax); 
        }
    }

    try {
        const productos = await Producto.findAll({
            //  5. Aplicar la cláusula WHERE a la tabla Producto
            where: whereProducto, // Si tienes filtros
            include: [
                { 
                  model: Categoria,
                  as: "categoria",
                  attributes: ["id", "nombre"] 
                },

                // INCLUSIÓN DE IMAGEN GENERAL DEL PRODUCTO (¡NUEVO BLOQUE!)
                // Necesario para obtener la imagen principal del catálogo.
                {
                    model: ProductoImagen, 
                    as: "imagenesProducto", // Alias para la relación Producto -> ProductoImagen
                    where: { principal: true }, // Solo la imagen principal
                    required: false,           // No requiere que exista una imagen
                    attributes: ["id", "url", "principal"] 
                },

                // 2. INCLUSIÓN DE VARIANTES Y SUS IMÁGENES
                {
                    model: VarianteProducto,
                    as: "variantes",
                    attributes: ["id", "color", "talla", "precio", "stock"],
                    include: [
                        { 
                          model: ProductoImagen, 
                          as: "imagenesVariante", // Alias para la relación Variante -> ProductoImagen
                          where: {principal: true}, 
                          required: false,         
                          attributes: ["id", "url", "principal"] 
                        }
                    ],
                },
            ],
        });

        res.json(productos);
    } catch (error) {
        console.error("Error al listar productos con filtros:", error);
        res.status(500).json({ error: "Error interno al listar productos" });
    }
};

// Obtener un producto específico con todos sus detalles
export const obtenerProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id, {
      include: [
        { model: Categoria,
          as: "categoria", 
          attributes: ["id", "nombre"] },
        {
          model: VarianteProducto,
          as: "variantes",
          attributes: ["id", "color", "talla", "precio", "stock"],
          include: [{ model: ProductoImagen, as: "imagenesVariante", attributes: ["id", "url", "principal"] }],
        },
        { 
          model: ProductoImagen, 
          as: 'imagenesProducto', // DEBE COINCIDIR con el alias de la asociación
        },
      ],
    });

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(producto);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ error: "Error interno al obtener producto" });
  }
};

// Crear un producto nuevo
/*export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, categoria_id, activo } = req.body;
    const nuevoProducto = await Producto.create({ nombre, descripcion, categoria_id, activo });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: "Error interno al crear producto" });
  }
};
export const crearProducto = async (req, res) => {
  try {
    const producto = await Producto.create(req.body, {
      include: [{ model: VarianteProducto, as: "variantes" }]
    });
    res.status(201).json(producto);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: "Error al crear producto" });
  }
};*/

// --- FUNCIÓN SIMULADA DE SUBIDA ---
// Esta función reemplaza la lógica de subida a Cloudinary/S3, 
// devolviendo URLs simuladas y metadatos.
// Crear un producto con VARIANTE (usando include de Sequelize) e IMÁGENES (separado)
export const crearProducto = async (req, res) => {
    // Asegúrate de leer 'variantes' del cuerpo
    const { 
        nombre, descripcion, precio_base, activo, categoria_id, 
        variantes // <-- LEER EL CAMPO VARIANTE
    } = req.body;
    const files = req.files; 

    // Usaremos un objeto simple para el producto principal (sin variantes ni imágenes aún)
    const datosProducto = {
        nombre, 
        descripcion, 
        precio_base: precio_base ? parseFloat(precio_base) : 0.00, 
        activo: activo === 'true', // Convertir el string 'true'/'false' de FormData a booleano
        categoria_id: parseInt(categoria_id),
        // CRÍTICO: El array de variantes DEBE estar en el objeto principal
        variantes: variantes ? JSON.parse(variantes) : [] 
    };
    
    // Si usas tu sintaxis de Sequelize, la transacción será implícita
    // Nota: Asegúrate de que las propiedades (talla, color, etc.) coincidan con el modelo VarianteProducto.
    try {
        // 1. CREAR PRODUCTO Y VARIANTES SIMULTÁNEAMENTE usando 'include'
        const nuevoProducto = await Producto.create(datosProducto, {
            // Asegúrate de que esta asociación 'as: "variantes"' sea la que definiste en tu modelo.
            include: [{ model: VarianteProducto, as: "variantes" }] 
        });

        const nuevoProductoId = nuevoProducto.id;

        // 2. Procesar y Asociar Imágenes
        if (files && files.length > 0) {
            // El Frontend debe enviar el campo 'isPrincipal' como un array de strings
            const isPrincipalArray = req.body.isPrincipal 
                ? (Array.isArray(req.body.isPrincipal) ? req.body.isPrincipal : [req.body.isPrincipal])
                : [];

            const imagenesParaGuardar = files.map((file, index) => ({
                url: `/uploads/${file.filename}`, 
                // APLICAR LÓGICA DE PRINCIPAL
                principal: isPrincipalArray[index] === 'true', 
                producto_id: nuevoProductoId,
            }));
            
            await ProductoImagen.bulkCreate(imagenesParaGuardar);
        }

        // 3. Devolver la respuesta completa
        const productoFinal = await Producto.findByPk(nuevoProductoId, {
             include: [
                 { model: ProductoImagen, as: 'imagenesProducto' }, 
                 { model: VarianteProducto, as: 'variantes' }
             ] 
        });

        res.status(201).json(productoFinal);

    } catch (error) {
        // Si falla la creación, Sequelize intenta el rollback del producto/variantes.
        // Si falla la subida de imágenes, el producto/variantes ya se crearon. 
        // Se recomienda usar transacciones explícitas aquí si la creación de imágenes no está acoplada al ORM.
        console.error("Error al crear producto con imágenes/variantes:", error);
        res.status(500).json({ error: "Error interno al crear el producto. Revisar log del servidor." });
    }
};

//Actualizar producto
/*export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, categoria_id } = req.body;

    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

    producto.nombre = nombre || producto.nombre;
    producto.descripcion = descripcion || producto.descripcion;
    producto.categoria_id = categoria_id || producto.categoria_id;

    await producto.save();
    res.json(producto);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error interno al actualizar producto" });
  }
};*/

//  PUT /api/v1/productos/:id
//  - Actualizar un producto existente.

/*export const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { 
        nombre, descripcion, precio, categoria_id, activo, 
        variantes // JSON string de variantes
    } = req.body;
    const files = req.files; 
    let transaction;

    try {
        transaction = await Producto.sequelize.transaction();
        
        const producto = await Producto.findByPk(id, { transaction });
        if (!producto) {
            await transaction.rollback();
            return res.status(404).json({ message: "Producto no encontrado para actualizar." });
        }

        // 1. Actualizar campos principales del Producto
        await producto.update({
            nombre,
            descripcion,
            precio: parseFloat(precio),
            categoria_id: parseInt(categoria_id),
            activo: activo === 'true',
        }, { transaction });

        // 2. Actualizar/Reemplazar Variantes
        if (variantes) {
            const variantesArray = JSON.parse(variantes);

            // Opción Segura: Eliminar todas las variantes antiguas y crear las nuevas
            await VarianteProducto.destroy({ where: { producto_id: id }, transaction });
            
            if (variantesArray.length > 0) {
                const nuevasVariantes = variantesArray.map(v => ({
                    ...v,
                    producto_id: id,
                }));
                await VarianteProducto.bulkCreate(nuevasVariantes, { transaction });
            }
        }
        
        // 3. Subir y Asociar Nuevas Imágenes (No borramos las antiguas aquí, solo añadimos)
        if (files && files.length > 0) {
            // Procesar los archivos de disco
            const imagenesParaGuardar = files.map(file => ({
                // CRÍTICO: '/uploads/' + el nombre de archivo que Multer guardó en disco
                url: `/uploads/${file.filename}`, 
                principal: true, // Asigna tu lógica de principal
                producto_id: id,
            }));
            await ProductoImagen.bulkCreate(imagenesParaGuardar, { transaction });
        }

        // 4. Commit de la Transacción
        await transaction.commit();

        // 5. Devolver el producto actualizado
        const productoFinal = await Producto.findByPk(id, {
             include: [
                 { model: ProductoImagen, as: 'imagenesProducto' }, 
                 { model: VarianteProducto, as: 'variantes' },
                 { model: Categoria, as: 'categoria' }
             ] 
        });

        res.json(productoFinal); // 200 OK

    } catch (error) {
        if (transaction && transaction.finished !== 'commit') {
            try {
                // Solo intenta rollback si la transacción NO ha finalizado con commit
                await transaction.rollback(); 
                console.log("Transacción revertida debido a un error de ejecución.");
            } catch (rollbackError) {
                // Captura el error si el rollback falló por estar ya terminado, 
                // pero no lo reporta al cliente, ya que el error original es el importante.
                console.error("Error al intentar rollback:", rollbackError.message);
            }
        }
      
      console.error("Error al actualizar producto:", error);
      res.status(500).json({ error: "Error interno al actualizar el producto." });
        
    }
};*/

export const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    
    // ... (Extracciones de req.body y normalización de mainImageKey) ...
    const { 
        nombre, descripcion, precio_base, activo, categoria_id, 
        variantes: variantesJson,
        existingImageIds: existingImageIdsJson
    } = req.body;
    const newFiles = req.files || [];
    
    let { mainImageKey } = req.body;
    if (Array.isArray(mainImageKey)) {
        mainImageKey = mainImageKey[0];
    }

    
    try {
        // 1. Conversión y Validación de Datos
        const variantes = variantesJson ? JSON.parse(variantesJson) : [];
        const existingImageIds = existingImageIdsJson ? JSON.parse(existingImageIdsJson) : [];
        const isActivo = activo === 'true';
        const basePrice = precio_base ? parseFloat(precio_base) : 0.00;
        const catId = categoria_id ? parseInt(categoria_id) : null;

        // 2. Transacción de Sequelize (Asegura atomicidad)
        const productoFinal = await sequelize.transaction(async (t) => { 
            
            // --- A, B, C: Lógica de Actualización de Producto, Variantes y Limpieza de Imágenes ---
            
            const producto = await Producto.findByPk(id, { transaction: t });
            if (!producto) {
                throw new Error("Producto no encontrado"); 
            }

            // Actualización de datos principales
            await producto.update({
                nombre, descripcion, precio_base: basePrice, activo: isActivo, categoria_id: catId,
            }, { transaction: t });

            // Gestión de variantes (Destroy y bulkCreate)
            await VarianteProducto.destroy({ where: { producto_id: id }, transaction: t });
            if (variantes.length > 0) {
                 const nuevasVariantes = variantes.map(v => ({ 
                     sku: v.sku, talla: v.talla, color: v.color, stock: v.stock,
                     precio: parseFloat(v.precio) || 0, peso: parseFloat(v.peso) || 0,
                     producto_id: id 
                 }));
                 await VarianteProducto.bulkCreate(nuevasVariantes, { transaction: t });
            }

            // Gestión de imágenes (Destrucción de antiguas y creación de nuevas)
            await ProductoImagen.destroy({
                where: { producto_id: id, id: { [Op.notIn]: existingImageIds } },
                transaction: t
            });
            const imagenesParaGuardar = newFiles.map(file => ({
                url: `/uploads/${file.filename}`, principal: false, producto_id: id,
            }));
            const nuevasImagenes = await ProductoImagen.bulkCreate(imagenesParaGuardar, { transaction: t });
            
            // 3. Determinar y Asignar la Imagen PRINCIPAL
            
            // Limpieza: Aseguramos que todas sean false
            await ProductoImagen.update({ principal: false }, { where: { producto_id: id }, transaction: t });

            let targetImageId = null;
            // ... (Tu lógica para determinar targetImageId a partir de mainImageKey) ...
            console.log("mainImagenKey recicbido: ", mainImageKey);

            if (mainImageKey && typeof mainImageKey === 'string' && mainImageKey.length > 0) {
                if (mainImageKey.startsWith('existing-')) {
                    targetImageId = parseInt(mainImageKey.split('-')[1]);
                } else if (mainImageKey.startsWith('new-')) {
                    const newIndex = parseInt(mainImageKey.split('-')[1]);
                    targetImageId = nuevasImagenes[newIndex]?.id; 
                }
            }
            console.log("targetImagenId asignado", targetImageId);
            
            // Asignación de principal: true
            if (targetImageId) {
                await ProductoImagen.update({ principal: true }, { where: { id: targetImageId }, transaction: t });
            }
            
            // PUNTO CRÍTICO DE DEBUGGING: Verificar el estado de la imagen 26 inmediatamente
            if (targetImageId) {
                const debugCheck = await ProductoImagen.findByPk(targetImageId, { transaction: t });
                console.log(`[DEBUG] Estado de la Imagen ${targetImageId} después del UPDATE:`, debugCheck.get('principal'));
            }
            
            // 4. Recargar el producto CON la transacción (para ver los cambios)
            const productoRecargado = await Producto.findByPk(id, { 
                 include: [
                     { model: ProductoImagen, as: 'imagenesProducto' }, 
                     { model: VarianteProducto, as: 'variantes' },
                     { model: Categoria, as: 'categoria' } 
                 ],
                 transaction: t 
            });
            
            return productoRecargado; // Devuelve el producto actualizado
        }); // Fin de la Transacción (COMMIT)

        // 5. Devolver la respuesta final
        res.status(200).json(productoFinal);
        
    } catch (error) {
        // ... (Tu manejo de errores) ...
        console.error(`Error al actualizar producto ID ${id}:`, error);
        res.status(500).json({ error: "Error interno al actualizar el producto.", details: error.message });
    }
};

// Eliminar producto
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);

    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

    await producto.destroy();
    res.json({ message: "Producto eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error interno al eliminar producto" });
  }
};

export const getNewProducts = async (req, res) => {
    try {
        const products = await Producto.findAll({
            // ORDENAR por createdAt (DESC = Más reciente primero)
            order: [['createdAt', 'DESC']], 
            // Limitar a 4 productos
            limit: 4, 
            include: [{ model: ProductoImagen, as: 'imagenesProducto' }],
        });
        res.json(products);
    } catch (error) {
        console.error("Error fetching new products:", error);
        res.status(500).json({ message: 'Error interno al obtener novedades' });
    }
};

export const getCatalogProducts = async (req, res) => {
    try {
        const products = await Producto.findAll({
            // ORDENAR por createdAt (ASC = Más Antiguo primero)
            order: [['createdAt', 'ASC']], 
            // Limitar a 5 productos
            limit: 5, 
            include: [{ model: ProductoImagen, as: 'imagenesProducto' }],
        });
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching catalog products:", error);
        res.status(500).json({ message: 'Error interno al obtener el catálogo' });
    }
};

export const getTrendingProducts = async (req, res) => {
    try {
        const products = await Producto.findAll({
            // Filtro para EXCLUIR productos sin votos
            // Esto asegura que si solo hay 1 voto, solo se muestra 1 producto.
            where: {
                rating: {
                    [Op.gt]: 0 // Solo rating mayor que 0
                }
            },
            
            // 📌 Ordenar por rating DESC (el mayor primero)
            order: [['rating', 'DESC']], 
            
            // 📌 Limitar a un máximo de 4, sin importar cuántos votados haya.
            limit: 4, 
            include: [{ model: ProductoImagen, as: 'imagenesProducto' }],
        });
        
        // 📌 Opcional: Si el array está vacío, puedes devolver un status 204 No Content
        // Aunque 200 con [] es estándar para endpoints de lista.
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching trending products:", error);
        res.status(500).json({ message: 'Error interno al obtener tendencias' });
    }
};


export const voteProduct = async (req, res) => {
    try {
        const { id } = req.params; 
        
        // 1. Usar findByPk para asegurar que el producto existe
        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado para votar.' });
        }

        // 2. Incrementar la columna 'rating' en 1 (Sequelize uses increment)
        await producto.increment('rating', { by: 1 });

        // 3. Opcional: Obtener el producto actualizado para devolver el nuevo rating
        await producto.reload(); 

        res.status(200).json({ 
            message: 'Voto registrado con éxito',
            newRating: producto.rating 
        });

    } catch (error) {
        console.error("Error al votar por el producto:", error);
        res.status(500).json({ message: 'Error interno al registrar el voto' });
    }
};


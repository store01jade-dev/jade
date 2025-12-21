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


export const crearProducto = async (req, res) => {
    const { 
        nombre, descripcion, precio_base, activo, categoria_id, 
        variantes 
    } = req.body;
    
    // Con Multer + CloudinaryStorage, las imágenes están en req.files
    const files = req.files; 

    const datosProducto = {
        nombre, 
        descripcion, 
        precio_base: precio_base ? parseFloat(precio_base) : 0.00, 
        activo: activo === 'true', 
        categoria_id: parseInt(categoria_id),
        variantes: variantes ? JSON.parse(variantes) : [] 
    };
    
    try {
        // 1. Crear producto y variantes (Sequelize se encarga)
        const nuevoProducto = await Producto.create(datosProducto, {
            include: [{ model: VarianteProducto, as: "variantes" }] 
        });

        const nuevoProductoId = nuevoProducto.id;

        // 2. Procesar y Asociar Imágenes de Cloudinary
        if (files && files.length > 0) {
            const isPrincipalArray = req.body.isPrincipal 
                ? (Array.isArray(req.body.isPrincipal) ? req.body.isPrincipal : [req.body.isPrincipal])
                : [];

            const imagenesParaGuardar = files.map((file, index) => ({
                // CAMBIO CLAVE: Usamos 'file.path', que es la URL de Cloudinary
                url: file.path, 
                principal: isPrincipalArray[index] === 'true', 
                producto_id: nuevoProductoId,
            }));
            
            await ProductoImagen.bulkCreate(imagenesParaGuardar);
        }

        // 3. Devolver respuesta con todo incluido
        const productoFinal = await Producto.findByPk(nuevoProductoId, {
             include: [
                 { model: ProductoImagen, as: 'imagenesProducto' }, 
                 { model: VarianteProducto, as: 'variantes' }
             ] 
        });

        res.status(201).json(productoFinal);

    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({ error: "Error interno al crear el producto." });
    }
};

export const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    
    const { 
        nombre, descripcion, precio_base, activo, categoria_id, 
        variantes: variantesJson,
        existingImageIds: existingImageIdsJson
    } = req.body;
    
    // Cloudinary nos entrega los archivos en req.files
    const newFiles = req.files || [];
    
    let { mainImageKey } = req.body;
    if (Array.isArray(mainImageKey)) {
        mainImageKey = mainImageKey[0];
    }

    try {
        const variantes = variantesJson ? JSON.parse(variantesJson) : [];
        const existingImageIds = existingImageIdsJson ? JSON.parse(existingImageIdsJson) : [];
        const isActivo = activo === 'true';
        const basePrice = precio_base ? parseFloat(precio_base) : 0.00;
        const catId = categoria_id ? parseInt(categoria_id) : null;

        const productoFinal = await sequelize.transaction(async (t) => { 
            
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

            // Gestión de imágenes
            // 1. Borrar de la DB las imágenes que el usuario quitó
            await ProductoImagen.destroy({
                where: { producto_id: id, id: { [Op.notIn]: existingImageIds } },
                transaction: t
            });

            // 2. CAMBIO CLAVE: Mapear las nuevas imágenes de Cloudinary
            // En lugar de `/uploads/${file.filename}`, usamos `file.path`
            const imagenesParaGuardar = newFiles.map(file => ({
                url: file.path, // <--- URL directa de Cloudinary (https://res.cloudinary.com/...)
                principal: false, 
                producto_id: id,
            }));

            const nuevasImagenes = await ProductoImagen.bulkCreate(imagenesParaGuardar, { transaction: t });
            
            // 3. Determinar y Asignar la Imagen PRINCIPAL
            await ProductoImagen.update({ principal: false }, { where: { producto_id: id }, transaction: t });

            let targetImageId = null;
            if (mainImageKey && typeof mainImageKey === 'string' && mainImageKey.length > 0) {
                if (mainImageKey.startsWith('existing-')) {
                    targetImageId = parseInt(mainImageKey.split('-')[1]);
                } else if (mainImageKey.startsWith('new-')) {
                    const newIndex = parseInt(mainImageKey.split('-')[1]);
                    targetImageId = nuevasImagenes[newIndex]?.id; 
                }
            }
            
            if (targetImageId) {
                await ProductoImagen.update({ principal: true }, { where: { id: targetImageId }, transaction: t });
            }
            
            // Recargar el producto para la respuesta
            const productoRecargado = await Producto.findByPk(id, { 
                 include: [
                     { model: ProductoImagen, as: 'imagenesProducto' }, 
                     { model: VarianteProducto, as: 'variantes' },
                     { model: Categoria, as: 'categoria' } 
                 ],
                 transaction: t 
            });
            
            return productoRecargado;
        });

        res.status(200).json(productoFinal);
        
    } catch (error) {
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


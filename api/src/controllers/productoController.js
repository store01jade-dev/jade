
import {
  Producto,
  Categoria,
  VarianteProducto,
  ProductoImagen,
} from "../models/index.js";

// Listar todos los productos con categorías, variantes e imágenes
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
        nombre, descripcion, precio, stock, categoria_id, 
        variantes // <-- LEER EL CAMPO VARIANTE
    } = req.body;
    const files = req.files; 

    // Usaremos un objeto simple para el producto principal (sin variantes ni imágenes aún)
    const datosProducto = {
        nombre, 
        descripcion, 
        precio: parseFloat(precio), 
        activo: activo === 'true', // CRÍTICO: Convertir el string 'true'/'false' de FormData a booleano
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

        // 2. Procesar y Asociar Imágenes (Lógica Asíncrona)
        if (files && files.length > 0) {
            // Sube las imágenes (simulado)
            const imagenData = subirImagenesSimuladas(files);
            
            const imagenesParaGuardar = imagenData.map(img => ({
                ...img,
                producto_id: nuevoProductoId,
            }));
            
            // Guardar en la tabla de imágenes (ESTE paso requiere una conexión/transacción separada o implícita)
            await ProductoImagen.bulkCreate(imagenesParaGuardar);
        }

        // 3. Devolver la respuesta completa
        const productoFinal = await Producto.findByPk(nuevoProductoId, {
             include: [
                 { model: ProductoImagen, as: 'imagenes' }, 
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
export const actualizarProducto = async (req, res) => {
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


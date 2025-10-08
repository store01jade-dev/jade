
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
const subirImagenesSimuladas = (files) => {
    return files.map((file, index) => {
        // En producción, la URL real vendría de la respuesta del servicio en la nube.
        const url = `https://miserviciodealmacenamiento.com/productos/${Date.now()}_${file.originalname.replace(/\s/g, '_')}`;
        
        return {
            url: url,
            principal: index === 0, // El primer archivo subido es la imagen principal
            sort_order: index,
        };
    });
};
// ----------------------------------

// Crear un producto con imágenes asociadas
export const crearProducto = async (req, res) => {
    // 1. Obtener datos y archivos
    const { name, description, price, stock, variantes } = req.body;
    const files = req.files; // <-- Archivos binarios de Multer

    try {
        // Validación básica (puedes expandirla)
        if (!name || !price) {
            return res.status(400).json({ error: "Faltan campos obligatorios (nombre, precio)." });
        }

        // 2. Crear el Producto principal (Sin imágenes por ahora)
        const nuevoProducto = await Producto.create({ 
            name, 
            description, 
            price: parseFloat(price), 
            stock: parseInt(stock) 
        });

        // 3. Procesar y Asociar Imágenes
        if (files && files.length > 0) {
            
            // a) Obtener datos de URL simuladas
            const imagenData = subirImagenesSimuladas(files);

            // b) Preparar datos para la inserción masiva (bulkCreate)
            const imagenesParaGuardar = imagenData.map(img => ({
                ...img,
                producto_id: nuevoProducto.id, // Enlaza con el ID del producto recién creado
            }));

            // c) Guardar todas las imágenes en la base de datos
            await ProductoImagen.bulkCreate(imagenesParaGuardar);
        }

        // 4. Procesar y Asociar Variantes (Si decides implementarlo)
        // La lógica de variantes es compleja ya que req.body está codificado como string
        // en FormData, necesitarías: JSON.parse(variantes). Por ahora lo omitimos.


        // 5. Devolver la respuesta completa
        const productoFinal = await Producto.findByPk(nuevoProducto.id, {
             // Asegúrate de que esta inclusión esté definida en tus asociaciones de Sequelize
             include: [{ model: ProductoImagen, as: 'imagenes' }] 
        });

        res.status(201).json(productoFinal);

    } catch (error) {
        console.error("Error al crear producto con imágenes:", error);
        // Si hay un error, puedes considerar eliminar el producto si ya se creó (transacción)
        res.status(500).json({ error: "Error interno al crear el producto" });
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


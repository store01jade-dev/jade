/*import Producto from "../models/Producto.js";
import Categoria from "../models/Categoria.js";

// Crear un producto
export const createProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, activo, categoria_id } = req.body;
        
        // Validar que exista la categoria
        const categoria = await Categoria.findByPk(categoria_id);
        if(!categoria){
            return res.status(400).json({ message: "Lacategoria no existe"});
        }

        const producto = await Producto.create({
            nombre,
            descripcion,
            precio,
            activo,
            categoria_id,
        });

        res.status(201).json({ message: "Produto creado con exito", producto });
    } catch (error) {
        console.error("Error en createProducto: ", error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
};

// Lsitar productos con su categoria
export const listProductos = async (req, res) =>{
    try {
        const productos = await Producto.findAll({
            include: {
                model: Categoria,
                as: "categoria",
                attributes: ["id", "nombre"],
            },
        });

        res.json(productos);
    } catch (error) {
        console.error("Error en listProductos ", error);
        res.status(500).json({ message: "Error ineterno en el servidor"});
    }
};

// Obtener productos
export const getProducto = async(req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id, {
            include: { 
                model: Categoria, 
                as: "categoria", 
                attributes: ["id", "nombre"]
            },
        });
        if(!producto){
            return res.status(400).json({ error: "Producto no encontrado" });
        }

        res.json(producto);
    } catch (error) {
        console.error("Error en getProducto: ", error);
        res.status(500).json({ message: "Error interno en el servidor"});
    }
};

// actualizar producto
export const updateProducto = async (req, res) =>{
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, categoria_ad } = req.body;

        const producto = await Producto.findByPk(id);
        if(!producto) {
            return res.status(404).json({ message: "Prodcto no encontrado" });
        }

        await producto.update({nombre, descripcion, precio, categoria_id });
        res.json({message: "Prdroducto actualizado con exito", producto });
    } catch (error) {
        console.error("Error en updateProducto: ", error);
        res.status(500).json({ message: "Error interno en l servidor" });
    }
};

// Eliminar producto
export const deleteProducto = async(req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);

        if (!producto){
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        await producto.destroy();
        res.json({ message: "Producto eliminado con exito"});
    } catch (error) {
        console.error("Error en deleteProdcuto: ", error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
};*/

import {
  Producto,
  Categoria,
  VarianteProducto,
  ProductoImagen,
} from "../models/index.js";

// 📌 Listar todos los productos con categorías, variantes e imágenes
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

// 📌 Obtener un producto específico con todos sus detalles
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

// 📌 Crear un producto nuevo
/*export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, categoria_id, activo } = req.body;
    const nuevoProducto = await Producto.create({ nombre, descripcion, categoria_id, activo });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: "Error interno al crear producto" });
  }
};*/
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
};

// 📌 Actualizar producto
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

// 📌 Eliminar producto
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


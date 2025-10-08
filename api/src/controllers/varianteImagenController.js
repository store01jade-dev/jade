
import { ProductoImagen, VarianteProducto } from "../models/index.js";

// Listar todas las imágenes
export const listarImagenes = async (req, res) => {
  try {
    const imagenes = await ProductoImagen.findAll({
      include: [{ model: VarianteProducto, attributes: ["id", "color", "talla"] }],
    });
    res.json(imagenes);
  } catch (error) {
    console.error("Error al listar imágenes:", error);
    res.status(500).json({ error: "Error interno al listar imágenes" });
  }
};

// Obtener una imagen específica
export const obtenerImagen = async (req, res) => {
  try {
    const imagen = await ProductoImagen.findByPk(req.params.id, {
      include: [{ model: VarianteProducto, attributes: ["id", "color", "talla"] }],
    });

    if (!imagen) return res.status(404).json({ error: "Imagen no encontrada" });

    res.json(imagen);
  } catch (error) {
    console.error("Error al obtener imagen:", error);
    res.status(500).json({ error: "Error interno al obtener imagen" });
  }
};

// Crear una imagen
export const crearImagen = async (req, res) => {
  try {
    const { variante_id, url, principal } = req.body;

    const nuevaImagen = await ProductoImagen.create({
      variante_id,
      url,
      principal,
    });

    res.status(201).json(nuevaImagen);
  } catch (error) {
    console.error("Error al crear imagen:", error);
    res.status(500).json({ error: "Error interno al crear imagen" });
  }
};

// Actualizar una imagen
export const actualizarImagen = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, principal } = req.body;

    const imagen = await ProductoImagen.findByPk(id);
    if (!imagen) return res.status(404).json({ error: "Imagen no encontrada" });

    imagen.url = url || imagen.url;
    imagen.principal = principal !== undefined ? principal : imagen.principal;

    await imagen.save();
    res.json(imagen);
  } catch (error) {
    console.error("Error al actualizar imagen:", error);
    res.status(500).json({ error: "Error interno al actualizar imagen" });
  }
};

// Eliminar una imagen
export const eliminarImagen = async (req, res) => {
  try {
    const { id } = req.params;
    const imagen = await ProductoImagen.findByPk(id);

    if (!imagen) return res.status(404).json({ error: "Imagen no encontrada" });

    await imagen.destroy();
    res.json({ message: "Imagen eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    res.status(500).json({ error: "Error interno al eliminar imagen" });
  }
};



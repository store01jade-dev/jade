/*import VarianteProducto  from "../models/VarianteProducto.js";

// Crear variante
export async function createVariante(req, res) {
  try {
    const variante = await VarianteProducto.create(req.body);
    res.status(201).json(variante);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la variante" });
  }
}

// Listar variantes
export async function getVariantes(req, res) {
  try {
    const variantes = await VarianteProducto.findAll();
    res.json(variantes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener variantes" });
  }
}

// Obtener variante por ID
export async function getVarianteById(req, res) {
  try {
    const variante = await VarianteProducto.findByPk(req.params.id);
    if (!variante) return res.status(404).json({ error: "Variante no encontrada" });
    res.json(variante);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener variante" });
  }
}

// Actualizar variante
export async function updateVariante(req, res) {
  try {
    const variante = await VarianteProducto.findByPk(req.params.id);
    if (!variante) return res.status(404).json({ error: "Variante no encontrada" });

    await variante.update(req.body);
    res.json(variante);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar variante" });
  }
}

// Eliminar variante
export async function deleteVariante(req, res) {
  try {
    const variante = await VarianteProducto.findByPk(req.params.id);
    if (!variante) return res.status(404).json({ error: "Variante no encontrada" });

    await variante.destroy();
    res.json({ message: "Variante eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar variante" });
  }
}*/

// src/controllers/varianteController.js

import { VarianteProducto, Producto, ProductoImagen } from "../models/index.js";

// 📌 Listar todas las variantes
export const listarVariantes = async (req, res) => {
  try {
    const variantes = await VarianteProducto.findAll({
      include: [
        { model: Producto, attributes: ["id", "nombre"] },
        { model: ProductoImagen, attributes: ["id", "url", "principal"] },
      ],
    });
    res.json(variantes);
  } catch (error) {
    console.error("Error al listar variantes:", error);
    res.status(500).json({ error: "Error interno al listar variantes" });
  }
};

// 📌 Obtener una variante específica
export const obtenerVariante = async (req, res) => {
  try {
    const variante = await VarianteProducto.findByPk(req.params.id, {
      include: [
        { model: Producto, attributes: ["id", "nombre"] },
        { model: ProductoImagen, attributes: ["id", "url", "principal"] },
      ],
    });

    if (!variante) return res.status(404).json({ error: "Variante no encontrada" });

    res.json(variante);
  } catch (error) {
    console.error("Error al obtener variante:", error);
    res.status(500).json({ error: "Error interno al obtener variante" });
  }
};

// 📌 Crear una variante
export const crearVariante = async (req, res) => {
  try {
    const { producto_id, sku, color, talla, precio, stock } = req.body;

    const nuevaVariante = await VarianteProducto.create({
      producto_id,
      sku,
      color,
      talla,
      precio,
      stock,
    });

    res.status(201).json(nuevaVariante);
  } catch (error) {
    console.error("Error al crear variante:", error);
    res.status(500).json({ error: "Error interno al crear variante" });
  }
};

// 📌 Actualizar una variante
export const actualizarVariante = async (req, res) => {
  try {
    const { id } = req.params;
    const { color, talla, precio, stock } = req.body;

    const variante = await VarianteProducto.findByPk(id);
    if (!variante) return res.status(404).json({ error: "Variante no encontrada" });

    variante.color = color || variante.color;
    variante.talla = talla || variante.talla;
    variante.precio = precio || variante.precio;
    variante.stock = stock || variante.stock;

    await variante.save();
    res.json(variante);
  } catch (error) {
    console.error("Error al actualizar variante:", error);
    res.status(500).json({ error: "Error interno al actualizar variante" });
  }
};

// 📌 Eliminar una variante
export const eliminarVariante = async (req, res) => {
  try {
    const { id } = req.params;
    const variante = await VarianteProducto.findByPk(id);

    if (!variante) return res.status(404).json({ error: "Variante no encontrada" });

    await variante.destroy();
    res.json({ message: "Variante eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar variante:", error);
    res.status(500).json({ error: "Error interno al eliminar variante" });
  }
};


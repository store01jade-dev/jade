//importamos el modelo de categoria
/*import Categoria from "../models/Categoria.js";

// crear categoria
export const crearCategoria = async(req, res) => {
    try {
        const { nombre, imagen_url } = req.body; // recogemos nombre e imagen
        //creamos la categoira en la BD
        const categoria = await Categoria.create({ nombre, imagen_url });
        res.status(201).json({ message: "Categoria creada ", categoria});
    } catch (error) {
        console.error("Error en crearCategoria: ", error);
        res.status(201).json({ error: "Error al crear categoria" });
    }
};

//listar categorias
export const listarCategorias = async(req, res) => {
    try {
        const categorias = await Categoria.findAll();
        res.json(categorias);
    } catch (error) {
        console.error("Error en listarCategorias: ", error);
        res.status(500).json({ error: "Error al listar categorias" });
    }
};

// Obtner una categoria por ID
export const obtenerCategoria = async(req, res) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id);
        if(!categoria){
            return res.status(401).json({ error: "Categoira no encontrada" });
        }
        req.json(categoria);
    } catch (error) {
        console.error("Error en obtenerCategoria: ", error);
        res.status(500).json({ error: " Error al obtener categoria" });
    }
};

// Actualizar una categoria
export const actualizarCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id);
        if(!categoria){
            return res.status(404).json({ error: "Categoria no encontrada" });
        }
        await categoria.update(req.boy);
        res.json({ message: "Categoria actualizada", categoria });
    } catch (error) {
        console.error( "Error en la actualizarCategoria: ", error);
        res.status(500).json({ error: "Error al actualizar categoria"})
    }
};

// Eliminar categoria
export const eliminarCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id);
        if(!categoria){
            return res.status(404).json({ error: "Categoria no encontrada" });
        }
        await categoria.destroy();
        res.json({ message: "Categoira eliminada" });
    } catch (error) {
        console.error("Error en eliminarCategoria:", error);
        res.status(500).json({ error: "Error al eliminar categoria" });
    }
};*/

// src/controllers/categoriaController.js

// Importamos los modelos que necesitamos desde el index central de modelos.
// Usamos desestructuring porque models/index.js exporta los modelos con nombre.
import { Categoria, Producto } from "../models/index.js";

// Importamos Op si en el futuro queremos buscar por patrón (opcional ahora).
import { Op } from "sequelize";

/*
  GET /api/v1/categorias
  - Lista todas las categorías (ruta pública).
*/
export const getCategorias = async (req, res) => {
  try {
    // Obtener un posible parámetro de búsqueda desde query (ej: ?q=camisa).
    // Esto permite búsquedas simples por nombre si lo necesitas.
    const { q } = req.query; // leer query para permitir búsquedas sencillas

    // Construir filtro condicionalmente si el cliente envía "q".
    const where = q
      ? { nombre: { [Op.like]: `%${q}%` } } // si hay q, usamos LIKE para búsqueda parcial
      : {}; // si no hay q, no filtramos

    // Traer las categorías desde la base de datos aplicando el filtro y ordenando por creación.
    const categorias = await Categoria.findAll({
      where, // filtro dinámico
      order: [["createdAt", "DESC"]], // ordenar por fecha (más recientes primero)
    });

    // Responder con la lista encontrada.
    return res.json(categorias); // 200 implícito
  } catch (error) {
    // Log detallado en servidor para depuración
    console.error("❌ Error en getCategorias:", error);
    // Respuesta genérica al cliente (no exponer errores internos).
    return res.status(500).json({ message: "Error al obtener categorías" });
  }
};

/*
  GET /api/v1/categorias/:id
  - Obtener una categoría por su ID (ruta pública).
*/
export const getCategoriaById = async (req, res) => {
  try {
    // Leer ID desde parámetros de ruta.
    const { id } = req.params; // id de la categoría solicitada

    // Buscar la categoría por PK.
    const categoria = await Categoria.findByPk(id); // buscar por llave primaria

    // Si no existe, devolver 404.
    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    // Devolver la categoría encontrada.
    return res.json(categoria); // 200
  } catch (error) {
    console.error("❌ Error en getCategoriaById:", error);
    return res.status(500).json({ message: "Error al obtener la categoría" });
  }
};

/*
  POST /api/v1/categorias
  - Crear una categoría (protegido: admin).
*/
export const createCategoria = async (req, res) => {
  try {
    // Extraer datos del body.
    const { nombre, imagen_url } = req.body; // imagen_url es opcional

    // Validaciones básicas: nombre obligatorio y longitud razonable.
    if (!nombre || typeof nombre !== "string" || nombre.trim().length === 0) {
      // 400 Bad Request si falta nombre
      return res.status(400).json({ message: "El campo 'nombre' es obligatorio" });
    }
    if (nombre.trim().length > 100) {
      // 400 si excede longitud
      return res.status(400).json({ message: "El nombre no puede exceder 100 caracteres" });
    }

    // Normalizar el nombre (trim) para evitar duplicados por espacios.
    const nombreNormalizado = nombre.trim();

    // Verificar que no exista otra categoría con el mismo nombre (evitar duplicados).
    const existente = await Categoria.findOne({ where: { nombre: nombreNormalizado } });
    if (existente) {
      // 409 Conflict si ya existe una categoría con ese nombre
      return res.status(409).json({ message: "Ya existe una categoría con ese nombre" });
    }

    // Crear la categoría en BD.
    const nuevaCategoria = await Categoria.create({
      nombre: nombreNormalizado,
      imagen_url: imagen_url || null, // aceptar null si no se envía
    });

    // Responder 201 Created con la categoría creada.
    return res.status(201).json(nuevaCategoria);
  } catch (error) {
    // Manejo específico si el error es de constraint unique (por si falla en concurrencia)
    if (error && error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Ya existe una categoría con ese nombre" });
    }

    console.error("❌ Error en createCategoria:", error);
    return res.status(500).json({ message: "Error al crear la categoría" });
  }
};

/*
  PUT /api/v1/categorias/:id
  - Actualizar una categoría (protegido: admin).
*/
export const updateCategoria = async (req, res) => {
  try {
    // Leer id y campos a actualizar del request.
    const { id } = req.params;
    const { nombre, imagen_url } = req.body;

    // Buscar la categoría a actualizar.
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      // 404 si no existe
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    // Si nos piden cambiar el nombre, validar y verificar duplicados.
    if (nombre !== undefined) {
      // Validación básica del nombre
      if (!nombre || typeof nombre !== "string" || nombre.trim().length === 0) {
        return res.status(400).json({ message: "El campo 'nombre' es obligatorio" });
      }
      if (nombre.trim().length > 100) {
        return res.status(400).json({ message: "El nombre no puede exceder 100 caracteres" });
      }

      const nombreNormalizado = nombre.trim();

      // Verificar duplicado: buscar otra categoría con ese nombre distinto al actual.
      const otra = await Categoria.findOne({
        where: { nombre: nombreNormalizado, id: { [Op.ne]: id } }, // id distinto
      });
      if (otra) {
        return res.status(409).json({ message: "Ya existe otra categoría con ese nombre" });
      }

      // Aplicar cambio de nombre
      categoria.nombre = nombreNormalizado;
    }

    // Si envían imagen_url, actualizarlo (puede ser null para borrar).
    if (imagen_url !== undefined) {
      categoria.imagen_url = imagen_url || null;
    }

    // Guardar cambios en BD.
    await categoria.save();

    // Responder con la categoría actualizada.
    return res.json(categoria);
  } catch (error) {
    console.error("❌ Error en updateCategoria:", error);
    return res.status(500).json({ message: "Error al actualizar la categoría" });
  }
};

/*
  DELETE /api/v1/categorias/:id
  - Eliminar una categoría (protegido: admin).
  - Buen práctica: no eliminar si hay productos asociados; pedir reasignación.
*/
export const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params; // id de la categoría a eliminar

    // Buscar la categoría.
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    // Verificar si existen productos asociados a esa categoría.
    const productoAsociado = await Producto.findOne({
      where: { categoria_id: id }, // buscar cualquier producto que use esta categoría
    });
    if (productoAsociado) {
      // 400 Bad Request: evitar borrado que dejaría productos huérfanos
      return res.status(400).json({
        message:
          "No se puede eliminar la categoría: existen productos asociados. Reasigna o elimina los productos primero.",
      });
    }

    // Si no hay productos asociados, proceder a eliminar.
    await categoria.destroy();

    // Responder éxito.
    return res.json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error en deleteCategoria:", error);
    return res.status(500).json({ message: "Error al eliminar la categoría" });
  }
};

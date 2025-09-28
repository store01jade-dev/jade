//importamos el modelo de categoria
import Categoria from "../models/Categoria.js";

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
};
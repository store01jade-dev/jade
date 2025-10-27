// controllers/commentController.js

import Comment from '../models/Comment.js'; 

// 1. POST: Recibir un nuevo comentario
export const submitComment = async (req, res) => {
    const { name, content } = req.body;
    
    if (!name || !content) {
        return res.status(400).json({ message: 'Nombre y comentario son obligatorios.' });
    }

    try {
        const newComment = await Comment.create({ name, content });
        res.status(201).json({ 
            message: 'Comentario enviado con éxito. Gracias por tu opinión.', 
            comment: newComment 
        });
    } catch (error) {
        console.error("Error al guardar comentario:", error);
        res.status(500).json({ message: 'Error interno al enviar el comentario.' });
    }
};

// 2. GET: Obtener los últimos 3 o 4 comentarios para la homepage
export const getHomepageComments = async (req, res) => {
    try {
        const comments = await Comment.findAll({
            // Queremos los más recientes primero
            order: [['createdAt', 'DESC']], 
            // Limitar a un número adecuado para la homepage (ej: 3 o 4)
            limit: 3, 
        });
        res.status(200).json(comments);
    } catch (error) {
        console.error("Error al obtener comentarios:", error);
        res.status(500).json({ message: 'Error interno al obtener comentarios.' });
    }
}; 
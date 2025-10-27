import express from "express";
import { submitComment, getHomepageComments } from "../controllers/commentController.js";


const router = express.Router();

// Rutas públicas
// GET para la homePage
router.get('/',getHomepageComments);
// POST para el footer
router.post('/', submitComment);

export default router;
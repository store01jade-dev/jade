// routes/contactRoutes.js (EJEMPLO ASUMIENDO EXPRESS)
import express from 'express';
import { Resend } from 'resend';
import dotenv from "dotenv";


dotenv.config();


const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/v1/contact/send-email
router.post('/send-email', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // 1. Verificación de campos
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Faltan campos obligatorios.' });
        }

        // 2. Verificación de la API Key (Seguridad)
        if (!process.env.RESEND_API_KEY) {
            console.error("❌ Error: RESEND_API_KEY no definida.");
            return res.status(500).json({ message: 'Error de configuración en el servidor.' });
        }

        // 3. Inicializar Resend dentro de la ruta para evitar errores al arrancar
        const resend = new Resend(process.env.RESEND_API_KEY);

        // 4. Envío del correo usando Resend (Reemplaza a transporter.sendMail)
        const { data, error } = await resend.emails.send({
            from: 'Tienda Jade <onboarding@resend.dev>', // Deja este para la prueba inicial
            to: 'tu-correo-registrado@gmail.com',         // EL CORREO DONDE QUIERES RECIBIRLO
            subject: `[CONTACTO WEB] Mensaje de: ${name}`,
            html: `
                <h3>Nuevo mensaje de contacto</h3>
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Correo del cliente:</strong> ${email}</p>
                <p><strong>Mensaje:</strong></p>
                <div style="border: 1px solid #ccc; padding: 10px;">${message}</div>
            `,
        });

        if (error) {
            console.error('Error de Resend:', error);
            return res.status(500).json({ message: 'Error al enviar el correo.' });
        }

        // 5. Respuesta de éxito
        res.status(200).json({ success: true, message: 'Mensaje enviado correctamente.' });

    } catch (error) {
        // AQUÍ ES DONDE ESTABA EL ERROR: Asegúrate de no usar 'transporter' aquí tampoco
        console.error('Error interno en la ruta de contacto:', error);
        res.status(500).json({ success: false, message: 'Fallo interno del servidor.' });
    }
});



export default router;
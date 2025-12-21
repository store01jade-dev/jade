// routes/contactRoutes.js (EJEMPLO ASUMIENDO EXPRESS)
import express from 'express'; 
import nodemailer from 'nodemailer';

const router = express.Router();

// Configuración del transportador: Asumo que tienes una función de configuración o lo haces aquí:
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Usa SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false // Esto ayuda en entornos de hosting como Render
    }
});

// POST /api/v1/contact/send-email
router.post('/send-email', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // 1. Validación básica
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Faltan campos obligatorios.' });
        }

        // 2. Configuración del correo
        const mailOptions = {
            from: process.env.EMAIL_USER, // Tu correo de envío (desde .env)

            // 📌 Destino: store01.jade@gmail.com
            to: 'store01.jade@gmail.com', 

            subject: `[CONTACTO WEB] Mensaje de: ${name}`,
            html: `
                <h3>Detalles del Cliente:</h3>
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Correo:</strong> ${email}</p>
                <p><strong>Mensaje:</strong></p>
                <div style="border: 1px solid #ccc; padding: 10px;">${message}</div>
            `,
        };

        // 3. Envío
        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: 'Mensaje enviado correctamente.' });

    } catch (error) {
        console.error('Error al enviar el correo de contacto:', error);
        res.status(500).json({ success: false, message: 'Fallo interno del servidor al enviar el correo.' });
    }
});

export default router;
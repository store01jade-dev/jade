import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail', // O el servicio que uses
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
    }
});

export const sendAdminOrderNotification = async (pedido, direccion) => {
    const mailOptions = {
        from: '"Tienda Jade" <tu_correo@gmail.com>',
        to: 'tu_correo_tienda@gmail.com',
        subject: `🚨 Nuevo Pedido #${pedido.id} - ¡A despachar!`,
        html: `
            <h1>Nuevo pedido recibido</h1>
            <p><strong>ID Pedido:</strong> #${pedido.id}</p>
            <p><strong>Total:</strong> $${pedido.total}</p>
            <hr />
            <h3>Datos de Envío:</h3>
            <ul>
                <li><strong>Cliente:</strong> ${direccion.nombre_quien_recibe}</li>
                <li><strong>Documento:</strong> ${direccion.documento_identidad}</li>
                <li><strong>Teléfono:</strong> ${direccion.telefono}</li>
                <li><strong>Ciudad:</strong> ${direccion.ciudad}</li>
                <li><strong>Barrio:</strong> ${direccion.barrio}</li>
                <li><strong>Dirección:</strong> ${direccion.direccion}</li>
                <li><strong>Notas:</strong> ${direccion.referencias || 'Ninguna'}</li>
            </ul>
        `
    };
    await transporter.sendMail(mailOptions);
};
import { Resend } from 'resend';

// Inicializamos Resend (se recomienda que la API KEY esté en Render)
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendAdminOrderNotification = async (pedido, direccion) => {
    try {
        const { data, error } = await resend.emails.send({
            // El remitente por defecto de Resend (o tu dominio verificado)
            from: 'Tienda Jade <onboarding@resend.dev>', 
            
            // El correo de la tienda donde quieres recibir la alerta
            to: 'store01.jade@gmail.com', 
            
            subject: `🚨 Nuevo Pedido #${pedido.id} - ¡A despachar!`,
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    <h1 style="color: #2c3e50;">Nuevo pedido recibido</h1>
                    <p><strong>ID Pedido:</strong> #${pedido.id}</p>
                    <p><strong>Total pagado:</strong> $${pedido.total.toLocaleString()}</p>
                    <hr />
                    <h3 style="color: #2c3e50;">Datos de Envío:</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li><strong>Cliente:</strong> ${direccion.nombre_quien_recibe}</li>
                        <li><strong>Documento:</strong> ${direccion.documento_identidad}</li>
                        <li><strong>Teléfono:</strong> ${direccion.telefono}</li>
                        <li><strong>Ciudad:</strong> ${direccion.ciudad}</li>
                        <li><strong>Barrio:</strong> ${direccion.barrio}</li>
                        <li><strong>Dirección:</strong> ${direccion.direccion}</li>
                        <li><strong>Notas:</strong> ${direccion.referencias || 'Ninguna'}</li>
                    </ul>
                    <p style="font-size: 0.8em; color: #7f8c8d; margin-top: 20px;">
                        Este es un mensaje automático generado por la plataforma Jade.
                    </p>
                </div>
            `,
        });

        if (error) {
            console.error("Error al enviar notificación de pedido:", error);
            return { success: false, error };
        }

        return { success: true, data };

    } catch (err) {
        console.error("Error inesperado en sendAdminOrderNotification:", err);
        return { success: false, error: err.message };
    }
};
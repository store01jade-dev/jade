// components/PolicyModal.js (Código modificado)
import React, { useState } from 'react';
import styles from './PolicyModal.module.css'; 

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;;

// 1. Componente del Formulario de Contacto
const ContactForm = ({ onClose }) => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Llamada a tu Backend externo
            const response = await fetch(`${BACKEND_API_URL}/api/v1/contact/send-email`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Podrías necesitar un token CSRF o una API Key si tu Backend lo requiere
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                // ✅ Solo si el servidor responde éxito
                alert('✅ Mensaje enviado con éxito. ¡Pronto te contactaremos!');
                onClose();
            }else {
                throw new Error(data.message || 'Error en el servidor de Backend.');
            }
            
            //alert('Mensaje enviado con éxito. ¡Pronto te contactaremos!');
            onClose(); 

        } catch (error) {
            console.error("Error al enviar el mensaje:", error);
            alert(`Hubo un error al enviar el mensaje: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
        
    };

    return (
        <form onSubmit={handleSubmit} className={styles.contactForm}>
            <input 
                type="text" 
                name="name" 
                placeholder="Tu Nombre" 
                value={formData.name} 
                onChange={handleChange} 
                required 
            />
            <input 
                type="email" 
                name="email" 
                placeholder="Tu Correo Electrónico" 
                value={formData.email} 
                onChange={handleChange} 
                required 
            />
            <textarea 
                name="message" 
                placeholder="Tu Mensaje" 
                value={formData.message} 
                onChange={handleChange} 
                required 
                rows="5"
            />
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
        </form>
    );
};


// 2. Contenido Estático del Modal
const MODAL_CONTENT_MAP = {
    // ---------------- Políticas ----------------
    Terminos: { content: <p>Aquí va el texto completo de los Términos y Condiciones...</p> },
    Privacidad: { content: <p>Detalle de cómo se manejan los datos personales...</p> },
    Declaracion: { content: <p>Explicación sobre la Declaración de Privacidad.</p> },
    Envio: { content: <p>Tiempos de procesamiento y costos de envío.</p> },
    Reembolso: { content: <p>Instrucciones y condiciones para devoluciones y reembolsos.</p> },
    
    // ---------------- Información ----------------
    Contacto: { content: <ContactForm /> }, // <-- Renderiza el Formulario
    FAQ: { 
        content: (
            <div>
                <h4>¿Cómo rastreo mi pedido?</h4>
                <p>Puedes usar el enlace 'Rastrea tu Pedido' en el footer e ingresar tu número de guía.</p>
                <h4>¿Cuánto tardan los envíos?</h4>
                <p>Nuestros envíos estándar tardan entre 3 y 5 días hábiles después del procesamiento.</p>
                <h4>¿Aceptan devoluciones?</h4>
                <p>Sí, aceptamos devoluciones dentro de los 30 días posteriores a la compra. Consulta nuestra Política de Reembolso.</p>
            </div>
        ) 
    },
};


export default function PolicyModal({ policyKey, onClose, policiesConfig, infoLinksConfig }) {
    if (!policyKey) {
        return null;
    }

    const modalData = MODAL_CONTENT_MAP[policyKey];
    
    // Buscar la configuración de título en ambos arrays
    const config = [...policiesConfig, ...infoLinksConfig].find(p => p.key === policyKey);

    if (!modalData || !config) {
        return null; 
    }
    
    const isContactForm = policyKey === 'Contacto';

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={`${styles.modalContent} ${isContactForm ? styles.smallModal : ''}`} onClick={(e) => e.stopPropagation()}>
                
                <header className={styles.modalHeader}>
                    <h2>{config.title}</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        &times;
                    </button>
                </header>
                
                <div className={styles.modalBody}>
                    {/* Si es Contacto, pasamos onClose al componente para que pueda cerrarse a sí mismo */}
                    {isContactForm ? <ContactForm onClose={onClose} /> : modalData.content} 
                </div>
                
            </div>
        </div>
    );
}
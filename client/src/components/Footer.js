'use client';
import React, { useState } from 'react';
import style from "./Footer.module.css";
import Image from "next/image";
import whatsapp from "../../public/icons/WhatsAppLight.svg";
import facebook from "../../public/icons/FacebookLight.svg";
import instagram from "../../public/icons/Instagramlight.svg";
import ticktock from "../../public/icons/TikTokLight.svg";
import email from "../../public/icons/EmailLight.svg";
//import logo from "../../public/assests/Logo-12.png";
import { useCommentRefresh } from './context/CommentRefreshContext';
import PolicyModal from './PolicyModal';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

//configuración para la columna de politicas
const policies = [
    { key: 'Terminos', label: 'Terminos y Condiciones', title: 'Términos y Condiciones de Uso' },
    { key: 'Privacidad', label: 'Politica de Privacidad', title: 'Política de Privacidad de Datos' },
    { key: 'Declaracion', label: 'Declaracion de Privacidad', title: 'Declaración de Privacidad' },
    { key: 'Envio', label: 'Politica de Envio', title: 'Política de Envío y Tiempos de Entrega' },
    { key: 'Reembolso', label: 'Politica de Reembolso', title: 'Política de Devolución y Reembolso' },
];

//configuración para la columna de Información
const infoLinks = [
    { key: 'Contacto', label: 'Contáctanos', action: 'modal', title: 'Envíanos un Mensaje' },
    { key: 'Tracking', label: 'Rastrea tu Pedido', action: 'link', href: '/tracking' },
    { key: 'FAQ', label: 'Preguntas Frecuentes (FAQ)', action: 'modal', title: 'Preguntas Frecuentes' },
    { key: 'Inicio', label: 'Ir al Inicio', action: 'link', href: '/' },
];

//Configuracion de la columna Redes
const WHATSAPP_NUMBER = "573113360711"; // Número en formato internacional: Código de país + Número
const FACEBOOK_URL = "https://www.facebook.com/TuTiendaJade";
const INSTAGRAM_URL = "https://www.instagram.com/TuTiendaJade";
const TIKTOK_URL = "https://www.tiktok.com/@TuTiendaJade";
const EMAIL_CONTACTO = "mailto:store01.jade@gmail.com";

export default function Footer() {
    const [formData, setFormData] = useState({ name: '', email: '', content: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const { triggerRefresh } = useCommentRefresh();

    // Estado para controlar qué modal está abierta. Inicialmente null (cerrada).
    const [activePolicy, setActivePolicy] = useState(null);

    // Función para cerrar la modal
    const closeModal = () => setActivePolicy(null);

    const handleChange = (e) => {
        // Usa e.target.name para capturar correctamente los datos
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}api/v1/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    content: formData.content, // Solo name y content son necesarios en el backend
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // ... (Limpiar formulario) ...
                // Llama a la función global, enviando la señal
                triggerRefresh(); 
            }

            if (!response.ok) {
                throw new Error(data.message || 'El servidor rechazó el comentario.');
            }

            setMessage('✅ ¡Comentario enviado con éxito!');
            setFormData({ name: '', email: '', content: '' });
            
            /* Llama a la función de recarga del componente padre (page.js)
            if (onCommentSubmitted) {
                onCommentSubmitted();
            }*/

        } catch (error) {
            console.error('Error al enviar el comentario:', error);
            setMessage(`Error: ${error.message || 'Inténtalo de nuevo.'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Lógica para el WhatsApp Chatbot Simple (Opción A)
    // Mensaje inicial pidiendo el nombre
    const whatsappMessage = encodeURIComponent(
        "¡Hola! Gracias por contactarnos. Por favor, escribe tu nombre y enseguida te atenderá un asesor."
    );
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

    return (
        <>
            <footer className={style.footer}>
                {/* 1. Columna de Políticas */}
                <section className={style.politicas}>
                    {policies.map((policy) => (
                        <a key={policy.key} onClick={() => setActivePolicy(policy.key)} role="button" tabIndex={0}>
                            {policy.label}
                        </a>
                    ))}
                </section>

                {/* 2. Columna de Información (MODIFICACIÓN AQUÍ) */}
                <section className={style.informacion}>
                    {infoLinks.map((link) => {
                        if (link.action === 'modal') {
                            return (
                                <a key={link.key} onClick={() => setActivePolicy(link.key)} role="button" tabIndex={0} >
                                    {link.label}
                                </a>
                            );
                        } else {
                            // Enlaces de navegación normales
                            return (
                                <a key={link.key} href={link.href}>
                                    {link.label}
                                </a>
                            );
                        }
                    })}
                </section>

                <section className={style.redes}>
    
                    {/* WHATSAPP (Abre el chat con el mensaje predefinido) */}
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" title="Chatea con nosotros por WhatsApp">
                        <Image src={whatsapp} alt="Whastapp" width={90} height={90}/>
                    </a>
                    
                    {/* FACEBOOK */}
                    <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" title="Visita nuestro Facebook">
                        <Image src={facebook} alt="facebook" width={90} height={90}/>
                    </a>
                    
                    {/* INSTAGRAM */}
                    <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" title="Síguenos en Instagram">
                        <Image src={instagram} alt="instagram" width={90} height={90}/>
                    </a>
                    
                    {/* TIKTOK */}
                    <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" title="Síguenos en TikTok">
                        <Image src={ticktock} alt="tiktok" width={90} height={90}/>
                    </a>
                    
                    {/* EMAIL (Abre el cliente de correo) */}
                    <a href={EMAIL_CONTACTO} target="_blank" rel="noopener noreferrer" title="Envíanos un correo">
                        <Image src={email} alt="email" width={80} height={80}/>
                    </a>
                    
                </section>

                <section className={style.comments}>
                    {/*<form className={style.form}>
                        <input type="text" placeholder="Nombre"/>
                        <input type="text" placeholder="email"/>
                        <textarea rows={5} cols={50}></textarea><br/><br/>
                        <button>Enviar</button>
                    </form>*/}
                    <h3>Déjanos tu Comentario</h3>
                    {/* Aplica los estilos y el manejo del formulario */}
                    <form className={style.form} onSubmit={handleSubmit}>
                        <input type="text" placeholder="Nombre" name="name" value={formData.name} onChange={handleChange} required disabled={isSubmitting} />
                        <input type="email" placeholder="Email (Opcional)" name="email" value={formData.email} onChange={handleChange} disabled={isSubmitting} />
                        <textarea rows={5} placeholder="Tu comentario" name="content" value={formData.content} onChange={handleChange} required disabled={isSubmitting}></textarea>
                        
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Enviando...' : 'Enviar'}
                        </button>
                        {message && <p className={style.submitMessage}>{message}</p>}
                    </form>
                </section>
                <p>© 2025 Jade. Todos los derechos reservados.</p>
            </footer>

            {/* El componente Modal se renderiza siempre, pero solo es visible si activePolicy no es null */}
            <PolicyModal 
                policyKey={activePolicy} 
                onClose={closeModal} 
                policiesConfig={policies}
                infoLinksConfig={infoLinks} // Pasamos la configuración para obtener el título
            />
        </>
    );
}

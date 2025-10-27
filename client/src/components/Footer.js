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

const API_BASE_URL = 'http://localhost:4000/api/v1';

export default function Footer() {
    const [formData, setFormData] = useState({ name: '', email: '', content: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const { triggerRefresh } = useCommentRefresh();

    const handleChange = (e) => {
        // Usa e.target.name para capturar correctamente los datos
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/comments`, {
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
            
            /* 📌 CRÍTICO: Llama a la función de recarga del componente padre (page.js)
            if (onCommentSubmitted) {
                onCommentSubmitted();
            }*/

        } catch (error) {
            console.error('Error al enviar el comentario:', error);
            setMessage(`❌ Error: ${error.message || 'Inténtalo de nuevo.'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer className={style.footer}>
            <section className={style.politicas}>
                <a>Terminos y Condiciones</a>
                <a>Politica de Privacidad</a>
                <a>Declaracion de Privacidad</a>
                <a>Politica de Envio</a>
                <a>Politica de Reembolso</a>
            </section>

            <section className={style.informacion}>
                <p>telefono</p>
                <p>Direccion</p>
                <p>Barrio y Ciudad</p>
                <p>Tienda virtual</p>
            </section>

            <section className={style.redes}>
                <Image src={whatsapp} alt="Whastapp" width={50} height={50}/>
                <Image src={facebook} alt="facebook" width={50} height={50}/>
                <Image src={instagram} alt="instagram" width={50} height={50}/>
                <Image src={ticktock} alt="tiktok" width={100} height={50}/>
                <Image src={email} alt="email" width={50} height={50}/>
                {/*<Image src={logo} alt="logo" width={80} height={80}/>*/}
            </section>

            <section className={style.comments}>
                {/*<form className={style.form}>
                    <input type="text" placeholder="Nombre"/>
                    <input type="text" placeholder="email"/>
                    <textarea rows={5} cols={50}></textarea><br/><br/>
                    <button>Enviar</button>
                </form>*/}
                <h3>Déjanos tu Comentario</h3>
                {/* 📌 Aplica los estilos y el manejo del formulario */}
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
    );
}

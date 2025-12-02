// src/app/forgot-password/page.js
'use client'; 
import React, { useState } from 'react';
import styles from './ForgotPassword.module.css'; // Usaremos estilos modulares

// URL del backend (Ajusta si es necesario)
const API_BASE_URL = 'http://localhost:4000/api/users';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            setError('Por favor, ingresa tu dirección de correo electrónico.');
            return;
        }

        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/password/forgot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            // Nota: El backend siempre responde con 200 si el email existe o no, 
            // para evitar la enumeración de usuarios (una buena práctica de seguridad).
            if (response.ok) {
                // Independientemente del resultado, mostramos un mensaje genérico.
                setMessage('Si tu cuenta existe, recibirás un enlace de restablecimiento en tu correo electrónico.');
                setEmail(''); // Limpiamos el campo
            } else {
                // Si hay un error de servidor (500), lo manejamos.
                const data = await response.json();
                setError(data.error || 'Ocurrió un error al enviar la solicitud.');
            }

        } catch (err) {
            console.error('Error de conexión:', err);
            setError('No se pudo conectar con el servidor. Inténtalo más tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <h1 className={styles.title}>¿Olvidaste tu Contraseña?</h1>
                <p className={styles.subtitle}>
                    Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            placeholder="tucorreo@ejemplo.com"
                            required
                            disabled={isLoading || !!message}
                        />
                    </div>

                    {error && <p className={styles.errorMessage}>{error}</p>}
                    {message && <p className={styles.successMessage}>{message}</p>}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isLoading || !!message}
                    >
                        {isLoading ? 'Enviando...' : 'Solicitar Enlace'}
                    </button>
                </form>
            </div>
        </div>
    );
}
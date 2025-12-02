// src/app/reset-password/[token]/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Hook para obtener los parámetros de la URL
import styles from '../ResetPassword.module.css'; // Usaremos el módulo de estilos

// URL del backend (Ajusta si es necesario)
const API_BASE_URL = 'http://localhost:4000/api/users';

export default function ResetPasswordPage() {
    const params = useParams(); // Obtenemos el objeto de parámetros de la URL
    const token = params.token; // El token está en la URL dinámica
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasReset, setHasReset] = useState(false);

    // Muestra un error si el token no está presente
    useEffect(() => {
        if (!token) {
            setError('Error: No se encontró el token de restablecimiento.');
        }
    }, [token]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!password || !confirmPassword) {
            setError('Por favor, completa ambos campos de contraseña.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        
        setIsLoading(true);
        setError('');
        
        try {
            // Llamamos al endpoint de backend que recibe el token y aplica el hash
            const response = await fetch(`${API_BASE_URL}/password/reset/${token}`, {
                method: 'PATCH', // Usamos PATCH o PUT
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }), // Solo enviamos la nueva contraseña
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('✅ ¡Contraseña restablecida con éxito! Ya puedes iniciar sesión.');
                setHasReset(true);
                setPassword('');
                setConfirmPassword('');
            } else {
                // El backend enviará un error 400 si el token es inválido o expiró
                setError(data.error || 'Error al restablecer. El enlace podría haber expirado.');
            }

        } catch (err) {
            console.error('Error de conexión:', err);
            setError('No se pudo conectar con el servidor. Verifica tu conexión.');
        } finally {
            setIsLoading(false);
        }
    };
    
    // Si el token no está presente o si ya se restableció la clave, renderizamos el mensaje final
    if (!token || hasReset) {
        return (
            <div className={styles.container}>
                <div className={styles.formCard}>
                    <h1 className={styles.title}>Estado del Restablecimiento</h1>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    {message && <p className={styles.successMessage}>{message}</p>}
                    <a href="/login" className={styles.loginLink}>Ir a Iniciar Sesión</a>
                </div>
            </div>
        );
    }
    
    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <h1 className={styles.title}>Nueva Contraseña</h1>
                <p className={styles.subtitle}>
                    Ingresa y confirma tu nueva contraseña para completar el proceso.
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>Nueva Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword" className={styles.label}>Confirmar Contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    {error && <p className={styles.errorMessage}>{error}</p>}
                    {message && <p className={styles.successMessage}>{message}</p>}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Guardando...' : 'Restablecer Contraseña'}
                    </button>
                </form>
            </div>
        </div>
    );
}
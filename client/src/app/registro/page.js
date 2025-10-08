// app/registro/page.js
'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import { useRouter } from 'next/navigation';
// Asumo que usarás los mismos estilos modulares de Login para consistencia
import styles from '../login/login.module.css'; 
import Link from 'next/link';

export default function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirección si el usuario ya está logueado
  if (isAuthenticated) {
    router.push('/'); 
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        setIsSubmitting(false);
        return;
    }
    
    // 1. Llamar a la función register del contexto
    const result = await register(nombre, email, password);

    // 2. Manejar la respuesta
    if (result.success) {
      setSuccess(result.message);
      // Opcional: Redirigir al login después de un registro exitoso
      router.push('/login'); 
    } else {
      setError(result.error);
    }
    
    setIsSubmitting(false);
  };

  if (isLoading) return <div className="loading-status">Cargando...</div>;

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.loginTitle}>Crear Cuenta</h1>
      
      {/* Mensaje de Éxito */}
      {success && <p className="success-message">{success}</p>}
      
      {/* Mensaje de Error */}
      {error && <p className={styles.errorMessage}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.loginForm}>
        
        {/* Campo de Nombre */}
        <div className={styles.formGroup}>
          <label htmlFor="nombre">Nombre Completo</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Campo de Email */}
        <div className={styles.formGroup}>
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Campo de Contraseña */}
        <div className={styles.formGroup}>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        
        {/* Campo de Confirmar Contraseña */}
        <div className={styles.formGroup}>
          <label htmlFor="confirm-password">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        
        {/* Botón de Envío */}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registrando...' : 'Registrarme'}
        </button>
        
        {/* Enlace a Login */}
        <p className={styles.registerLink}>
            ¿Ya tienes cuenta? <Link href="/login">Ingresa aquí</Link>
        </p>
      </form>
    </div>
  );
}
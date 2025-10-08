// app/login/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Ajusta la ruta a tu AuthContext
import { useRouter } from 'next/navigation';
import style from "./login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Obtenemos la función login y el estado de autenticación
  const { login, isAuthenticated, isLoading, user} = useAuth();
  const router = useRouter();

  // 1. Efecto para la Redirección Inmediata después del Login exitoso
  useEffect(() => {
    // Si la autenticación es exitosa DENTRO de esta página, redirigimos
    // 2. Debe estar autenticado (isAuthenticated=true)
    if (!isLoading && isAuthenticated) {
        // Si el token es válido, te saca de aquí.
        const userRole = user?.rol; 

        if (userRole === "admin") {
            router.push('/admin/dashboard');
        } else {
            router.push('/');
        }
    }
}, [isAuthenticated, isLoading, router, user]); 

// 2. Renderizado Condicional: Esperar la Carga Inicial
// Si el contexto está cargando, o si ya estás autenticado, OCULTA el formulario.
if (isLoading || isAuthenticated) {
    return <div className="loading-status" style={{textAlign: 'center', padding: '100px'}}>Cargando o Redirigiendo...</div>;
}


  // Función que se activa al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // 1. Llamar a la función login del contexto
    const result = await login(email, password);

    // 2. Manejar la respuesta
    if (result.success) {
      // --- SOLUCIÓN DEL PANTALLAZO: Retraso para la propagación del Contexto ---
        setTimeout(() => {
             // El useEffect de arriba debería redirigir ahora que isAuthenticated es true.
             // Si quieres forzar la redirección aquí para inmediatez:
             router.push('/'); 
        }, 50); // 50ms (mínimo necesario para un ciclo de renderizado)
    } else {
      setError(result.error);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className={style.loginContainer}>
      <h1 className={style.loginTitle}>Ingresar</h1>
      
      {/* Mensaje de Error */}
      {error && <p className={style.errorMessage}>{error}</p>}

      <form onSubmit={handleSubmit} className={style.loginForm}>
        
        {/* Campo de Email */}
        <div className={style.formGroup}>
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
        <div className={style.formGroup}>
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
        
        {/* Botón de Envío */}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
        
        {/* Enlace a Registro (futuro) */}
        <p className={style.registerLink}>
            ¿No tienes cuenta? <a href="/registro">Regístrate aquí</a>
        </p>
      </form>
    </div>
  );
}
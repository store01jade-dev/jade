// components/auth/ProtectedRoute.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext'; // Asegúrate de la ruta correcta

/**
 * Componente que envuelve el contenido y protege la ruta.
 *
 * @param {string} requiredRole - El rol necesario ('cliente' o 'admin').
 * @param {React.ReactNode} children - El contenido a proteger.
 */
export default function ProtectedRoute({ requiredRole, children }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si aún está cargando la autenticación (e.g., leyendo localStorage), no hacemos nada
    if (isLoading) return;

    // 1. Verificar Autenticación
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para acceder a esta página.");
      router.push('/login');
      return;
    }

    // 2. Verificar Rol (si se requiere un rol específico)
    if (requiredRole && user?.rol !== requiredRole) {
      alert("No tienes permiso para acceder a esta área.");
      router.push('/'); // Redirigir a la página principal o a una de error
    }
  }, [isLoading, isAuthenticated, user, requiredRole, router]);

  // Mostrar un spinner de carga mientras se verifica el estado
  if (isLoading || !isAuthenticated || (requiredRole && user?.rol !== requiredRole)) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        {isLoading ? 'Verificando acceso...' : 'Redirigiendo...'}
      </div>
    );
  }

  // Si el usuario está autenticado y tiene el rol correcto, renderizar el contenido
  return <>{children}</>;
}
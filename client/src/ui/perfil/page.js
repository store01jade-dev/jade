// app/perfil/page.js
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

// Contenido del Perfil del Cliente
function PerfilPageContent() {
  const { user } = useAuth(); // Usamos useAuth en el componente interno

  return (
    <div className="content-container" style={{ padding: '40px 0' }}>
      <h1>👤 Perfil de Usuario</h1>
      <p>Bienvenido, {user?.nombre || user?.email}!</p>
      
      <section>
        <h2>Mis Datos</h2>
        <p>Email: {user?.email}</p>
        <p>Rol: {user?.rol}</p>
        {/* Aquí irán los formularios para actualizar datos */}
      </section>
      
      <section>
        <h2>Mis Pedidos</h2>
        {/* Componente para listar pedidos */}
      </section>
    </div>
  );
}

// Envolver la página con ProtectedRoute
export default function PerfilPage() {
    // Al no pasar requiredRole, solo verifica isAuthenticated = true
    return (
        <ProtectedRoute>
            <PerfilPageContent />
        </ProtectedRoute>
    );
}
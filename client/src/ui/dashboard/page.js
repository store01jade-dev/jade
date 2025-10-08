// app/admin/dashboard/page.js
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { useAuth } from '../../../context/AuthContext';

// Contenido del Dashboard de Administrador
function AdminDashboardContent() {
  const { user } = useAuth(); // Usamos useAuth en el componente interno

  return (
    <div className="content-container" style={{ padding: '40px 0' }}>
      <h1 style={{ color: '#ac4e4e' }}>🔒 Dashboard de Administración</h1>
      <p>Acceso concedido para el Administrador: {user?.email}</p>
      
      <section>
        <h2>Gestión de Productos</h2>
        {/* Enlaces a Crear, Editar, Eliminar productos */}
      </section>
      
      <section>
        <h2>Gestión de Pedidos</h2>
        {/* Componente para ver todos los pedidos y sus estados */}
      </section>
    </div>
  );
}

// Envolver la página con ProtectedRoute, requiriendo el rol 'admin'
export default function AdminDashboardPage() {
    return (
        <ProtectedRoute requiredRole="admin">
            <AdminDashboardContent />
        </ProtectedRoute>
    );
}
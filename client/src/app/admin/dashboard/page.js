// app/admin/dashboard/page.js
'use client';

import ProtectedRoute from '../../../components/auth/ProtectedRoute'; // Ajusta la ruta si es necesario
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext'; // Necesario para el componente interno

// Contenido del Dashboard de Administrador
function AdminDashboardContent() {
  const { user } = useAuth(); 

  return (
    <div className="admin-dashboard-container" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#4CAF50', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
          Panel de Administración
      </h1>
      <p>Bienvenido, **{user?.email}** (Rol: {user?.rol}).</p>

      <div className="dashboard-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px', 
          marginTop: '30px' 
      }}>
          
          {/* Card: Gestión de Productos */}
          <Link href="/admin/productos" passHref>
            <div className="dashboard-card" style={cardStyle}>
                <h2>📦 Productos</h2>
                <p>Añadir, editar y eliminar productos del inventario.</p>
            </div>
          </Link>

          {/* Card: Gestión de Pedidos */}
          <Link href="/admin/pedidos" passHref>
            <div className="dashboard-card" style={cardStyle}>
                <h2>🛒 Pedidos</h2>
                <p>Ver y gestionar todos los pedidos de los clientes.</p>
            </div>
          </Link>
          
          {/* Card: Gestión de Usuarios */}
          <Link href="/admin/usuarios" passHref>
            <div className="dashboard-card" style={cardStyle}>
                <h2>👥 Usuarios</h2>
                <p>Administrar cuentas de usuario y roles.</p>
            </div>
          </Link>
      </div>
    </div>
  );
}

// Estilo básico para las tarjetas (puedes moverlo a CSS)
const cardStyle = {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s',
    cursor: 'pointer',
    textAlign: 'center'
};
// Hover effect (solo conceptualmente, necesitarías CSS Modules para esto)
// cardStyle[':hover'] = { transform: 'translateY(-5px)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' };


// Envolver la página con ProtectedRoute
export default function AdminDashboardPage() {
    return (
        <ProtectedRoute requiredRole="admin">
            <AdminDashboardContent />
        </ProtectedRoute>
    );
}
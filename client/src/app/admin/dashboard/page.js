// app/admin/dashboard/page.js
'use client';

import ProtectedRoute from '../../../components/auth/ProtectedRoute'; 
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import styles from './Dashboard.module.css'; // <-- Importar CSS Modules

// Contenido del Dashboard de Administrador
function AdminDashboardContent() {
  const { user } = useAuth(); 

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
          Panel de Administración
      </h1>
      <p className={styles.welcomeMessage}>Bienvenido, <strong>{user?.email}</strong> (Rol: {user?.rol}).</p>

      <div className={styles.dashboardGrid}>
          
          {/* Card: Gestión de Productos */}
          <Link href="/admin/productos" passHref className={styles.card}>
                <h2>📦 Productos</h2>
                <p>Añadir, editar y eliminar productos del inventario.</p>
          </Link>

          {/* Card: Gestión de Categorías (NUEVO ENLACE) */}
          <Link href="/admin/categorias" passHref className={styles.card}>
                <h2>🏷️ Categorías</h2>
                <p>Crear, actualizar y gestionar las categorías del catálogo.</p>
          </Link>

          {/* Card: Gestión de Pedidos */}
          <Link href="/admin/pedidos" passHref className={styles.card}>
                <h2>🛒 Pedidos</h2>
                <p>Ver y gestionar todos los pedidos de los clientes.</p>
          </Link>
          
          {/* Card: Gestión de Usuarios */}
          <Link href="/admin/usuarios" passHref className={styles.card}>
                <h2>👥 Usuarios</h2>
                <p>Administrar cuentas de usuario y roles.</p>
          </Link>
      </div>
    </div>
  );
}

// Envolver la página con ProtectedRoute
export default function AdminDashboardPage() {
    return (
        <ProtectedRoute requiredRole="admin">
            <AdminDashboardContent />
        </ProtectedRoute>
    );
}
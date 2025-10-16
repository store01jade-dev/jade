// app/admin/productos/page.js
'use client';

import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { FaPlus, FaList, FaEdit, FaTrash, FaTag } from 'react-icons/fa';
import styles from './ProductList.module.css'; // <-- ¡Importar CSS Modules!

function ProductManagementContent() {
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // CRÍTICO: Usamos v1 para coincidir con la estructura de categorías
    const API_URL = 'http://localhost:4000/api/v1/productos'; 

    // Función de Lectura: Obtener la lista de productos
    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);
        if (!token) {
            setError("Token no disponible. Por favor, vuelva a iniciar sesión.");
            setIsLoading(false);
            return;
        }

        try {
            // Nota: Tu backend DEBE estar configurado para incluir la categoría
            // en la respuesta GET /api/v1/productos. Si no lo está,
            // esta columna aparecerá vacía hasta que configures la asociación
            // Producto.belongsTo(Categoria) y uses { include: [Categoria] } en tu controller GET.
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setProducts(data);
            } else {
                setError(data.message || 'Error al cargar productos del servidor.');
            }
        } catch (err) {
            console.error("Error fetching products:", err);
            setError('Error de conexión con el servidor.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchProducts();
        }
    }, [token]);

    const handleDelete = async (productId) => {
        // ... (Lógica de eliminación usando token) ...
        if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
         try {
            const response = await fetch(`${API_URL}/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                alert('Producto eliminado exitosamente.');
                fetchProducts(); // Recargar
            } else {
                const data = await response.json();
                setError(data.message || 'Error al eliminar el producto.');
            }
        } catch (err) {
            setError('Error de conexión al intentar eliminar.');
        }
    };

    const cardData = [
        { title: 'Crear Nuevo', href: '/admin/productos/nuevo', icon: FaPlus },
        { title: 'Gestionar Categorías', href: '/admin/categorias', icon: FaTag }, // <-- Nuevo Enlace
        { title: 'Recargar Lista', onClick: fetchProducts, icon: FaList }, 
        { title: 'Gestionar Edición', href: '#products', icon: FaEdit }, 
    ];

    if (isLoading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando productos...</div>;
    
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Panel de Productos</h1>

            {error && <div className={styles.error}>Error: {error}</div>}

            {/* Menú de Cards para Navegación */}
            <div className={styles.cardGrid}>
                {cardData.map((card, index) => (
                    card.href ? (
                        <Link key={index} href={card.href} passHref className={styles.card}>
                            <card.icon className={styles.icon} />
                            <span>{card.title}</span>
                        </Link>
                    ) : (
                        <div key={index} onClick={card.onClick} className={styles.card} style={{ backgroundColor: '#e9ecef' }}>
                            <card.icon className={styles.icon} />
                            <span>{card.title}</span>
                        </div>
                    )
                ))}
            </div>

            {/* Listado de Productos */}
            <h2 id="products" className={styles.listHeading}>Inventario Actual ({products.length})</h2>
            
            {products.length === 0 ? (
                <p>No hay productos en el inventario. ¡Crea uno nuevo!</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio Base</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.nombre}</td>
                                <td>
                                    {/* Asumo que la categoría viene anidada como 'Categoria' o 'Category' */}
                                    {product.categoria ? product.categoria.nombre : 'Sin Categoría'}
                                </td>
                                <td>{product.variantes && product.variantes.length > 0
                                        ? `$${parseFloat(product.variantes[0].precio).toFixed(2)}`
                                        : '$N/A'}
                                </td>
                                <td>
                                    <Link href={`/admin/productos/${product.id}/editar`} passHref>
                                        <button className={`${styles.actionButton} ${styles.editButton}`}>
                                            <FaEdit style={{ marginRight: '5px' }} /> Editar
                                        </button>
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(product.id)}
                                        className={`${styles.actionButton} ${styles.deleteButton}`}
                                    >
                                        <FaTrash style={{ marginRight: '5px' }} /> Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default function ProductManagementPage() {
    return (
        <ProtectedRoute requiredRole="admin">
            <ProductManagementContent />
        </ProtectedRoute>
    );
}
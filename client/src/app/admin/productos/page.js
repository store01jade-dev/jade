// app/admin/productos/page.js
'use client';

import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext'; // Para obtener el token
import { FaPlus, FaList, FaEdit, FaTrash } from 'react-icons/fa'; // Iconos para las cards

// --- Estilos ---
const cardStyle = {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    textAlign: 'center',
    textDecoration: 'none',
    color: '#333',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    transition: '0.3s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'white',
};

const iconStyle = {
    fontSize: '24px',
    color: '#007bff',
};
// ---------------

// Componente para listar y gestionar productos
function ProductManagementContent() {
    const { token } = useAuth(); // Obtener el token del administrador
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = 'http://localhost:4000/api/v1/productos'; // ¡Ajusta tu URL de Express!

    // Función de Lectura: Obtener la lista de productos (CRUD: READ)
    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);
        if (!token) {
            setError("Token no disponible. Por favor, vuelva a iniciar sesión.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Pasar el JWT
                },
            });

            const data = await response.json();

            if (response.ok) {
                setProducts(data);
            } else {
                // El servidor devolvió un error (ej. "Acceso denegado")
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
        // Solo intentamos cargar si ya tenemos el token
        if (token) {
            fetchProducts();
        }
    }, [token]); // Dependencia del token

    // --- Lógica de Eliminación (CRUD: DELETE) ---
    const handleDelete = async (productId) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

        try {
            const response = await fetch(`${API_URL}/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert('Producto eliminado exitosamente.');
                fetchProducts(); // Recargar la lista
            } else {
                const data = await response.json();
                setError(data.message || 'Error al eliminar el producto.');
            }
        } catch (err) {
            setError('Error de conexión al intentar eliminar.');
        }
    };
    // --------------------------------------------

    const cardData = [
        { title: 'Crear Nuevo', href: '/admin/productos/nuevo', icon: FaPlus },
        // La card de 'Listar' es la página actual, así que redirigimos a sí misma o la usamos para Recargar
        { title: 'Recargar Lista', onClick: fetchProducts, icon: FaList }, 
        // Agrupamos Editar y Eliminar en la tabla, pero podemos poner una card de 'Acciones'
        { title: 'Gestionar Stock', href: '#products', icon: FaEdit }, 
    ];

    if (isLoading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando productos...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>Error: {error}</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>Panel de Productos</h1>

            {/* Menú de Cards para Navegación */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {cardData.map((card, index) => (
                    card.href ? (
                        <Link key={index} href={card.href} passHref style={cardStyle}>
                            <card.icon style={iconStyle} />
                            <span>{card.title}</span>
                        </Link>
                    ) : (
                        <div key={index} onClick={card.onClick} style={{ ...cardStyle, cursor: 'pointer', backgroundColor: '#e9ecef' }}>
                            <card.icon style={iconStyle} />
                            <span>{card.title}</span>
                        </div>
                    )
                ))}
            </div>

            {/* Listado de Productos (CRUD: READ & DELETE) */}
            <h2 id="products" style={{ marginBottom: '20px' }}>Inventario Actual ({products.length})</h2>
            
            {products.length === 0 ? (
                <p>No hay productos en el inventario. ¡Crea uno nuevo!</p>
            ) : (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>${product.price ? parseFloat(product.price).toFixed(2) : 'N/A'}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <Link href={`/admin/productos/${product.id}/editar`} passHref>
                                        <button style={{ ...actionButtonStyle, backgroundColor: '#FFC107' }}>
                                            <FaEdit style={{ marginRight: '5px' }} /> Editar
                                        </button>
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(product.id)}
                                        style={{ ...actionButtonStyle, backgroundColor: '#DC3545', marginLeft: '10px' }}
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

// Estilos de la tabla
const tableStyle = { 
    width: '100%', 
    borderCollapse: 'collapse', 
    backgroundColor: 'white', 
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
};
// Estilos de los botones
const actionButtonStyle = { 
    padding: '8px 12px', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer', 
    color: 'white',
    display: 'inline-flex',
    alignItems: 'center',
    fontWeight: 'bold',
};


export default function ProductManagementPage() {
    return (
        <ProtectedRoute requiredRole="admin">
            <ProductManagementContent />
        </ProtectedRoute>
    );
}
'use client';

import ProtectedRoute from '../../../../../components/auth/ProtectedRoute';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../../context/AuthContext'; // Para obtener el token
import { FaSave, FaArrowLeft } from 'react-icons/fa'; // Iconos

// El componente recibe los parámetros de la ruta, incluido el ID
function EditProductContent({ params }) {
    const productId = params.id;
    const router = useRouter();
    const { token } = useAuth();
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_URL = `http://localhost:4000/api/productos/${productId}`; // Ruta específica

    // ----------------------------------------------------
    // 1. CARGAR DATOS DEL PRODUCTO EXISTENTE (GET)
    // ----------------------------------------------------
    useEffect(() => {
        if (!token || !productId) return;
        
        const fetchProduct = async () => {
            try {
                const response = await fetch(API_URL, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    // Cargar los datos en el estado del formulario
                    setFormData({
                        name: data.name || '',
                        description: data.description || '',
                        price: data.price || '',
                        stock: data.stock || '',
                    });
                } else {
                    setError(data.message || 'No se pudo cargar el producto.');
                }
            } catch (err) {
                setError('Error de conexión al cargar el producto.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [token, productId, API_URL]); // Se ejecuta al obtener el token y el id

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ----------------------------------------------------
    // 2. ACTUALIZAR PRODUCTO (PUT/PATCH)
    // ----------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        if (!token) {
            setError("Error: Token de autenticación no disponible.");
            setIsSubmitting(false);
            return;
        }

        try {
            // Usamos 'PUT' o 'PATCH' dependiendo de tu API (PUT es común para reemplazo total)
            const response = await fetch(API_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Producto actualizado exitosamente!');
                router.push('/admin/productos'); // Redirigir a la lista
            } else {
                setError(data.message || 'Error al actualizar el producto.');
            }
        } catch (err) {
            console.error('Error de conexión:', err);
            setError('No se pudo conectar con el servidor.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div style={loadingStyle}>Cargando datos del producto...</div>;
    if (error && !isSubmitting) return <div style={errorStyle}>Error: {error}</div>;

    return (
        <div style={containerStyle}>
            <button onClick={() => router.push('/admin/productos')} style={backButtonStyle}>
                <FaArrowLeft style={{ marginRight: '5px' }} /> Volver a Productos
            </button>
            <h1 style={headingStyle}>Editar Producto: {formData.name || productId}</h1>
            
            {error && <p style={formErrorStyle}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={formStyle}>
                
                <label style={labelStyle}>
                    Nombre:
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
                </label>

                <label style={labelStyle}>
                    Descripción:
                    <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" style={inputStyle}></textarea>
                </label>

                <label style={labelStyle}>
                    Precio ($):
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0.01" step="0.01" style={inputStyle} />
                </label>

                <label style={labelStyle}>
                    Stock:
                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" style={inputStyle} />
                </label>

                <button type="submit" disabled={isSubmitting} style={buttonStyle}>
                    <FaSave style={{ marginRight: '8px' }} />
                    {isSubmitting ? 'Guardando Cambios...' : 'Guardar Cambios'}
                </button>
            </form>
        </div>
    );
}

// --- Estilos ---
const containerStyle = { padding: '40px', maxWidth: '800px', margin: '0 auto' };
const headingStyle = { marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '10px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' };
const labelStyle = { display: 'flex', flexDirection: 'column', fontWeight: 'bold' };
const inputStyle = { padding: '12px', marginTop: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' };
const buttonStyle = { padding: '15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const backButtonStyle = { padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center' };
const loadingStyle = { textAlign: 'center', padding: '100px', fontSize: '1.2rem', color: '#007bff' };
const errorStyle = { color: 'red', textAlign: 'center', padding: '50px', border: '1px solid red', backgroundColor: '#fee' };
const formErrorStyle = { color: 'red', border: '1px solid red', padding: '10px', borderRadius: '4px', marginBottom: '15px' };


export default function EditProductPage({ params }) {
    return (
        <ProtectedRoute requiredRole="admin">
            {/* Pasamos los parámetros de la ruta al componente hijo */}
            <EditProductContent params={params} />
        </ProtectedRoute>
    );
}
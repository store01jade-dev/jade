'use client';

import ProtectedRoute from '../../../../components/auth/ProtectedRoute';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Asumimos que tienes un hook o una función para obtener el JWT del Admin
import { useAuth } from '../../../../context/AuthContext'; 

// Componente para la lógica del formulario
function NewProductContent() {
    const router = useRouter();
    const { token } = useAuth(); // Necesitas el token para la ruta protegida
    // --- NUEVO ESTADO PARA MANEJAR ARCHIVOS ---
    const [selectedFiles, setSelectedFiles] = useState([]);
    // --- NUEVOS ESTADOS PARA CATEGORÍAS ---
    const [categories, setCategories] = useState([]);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
    
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoria_id: '', // <-- Campo para el ID de la categoría
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const API_BASE_URL = 'http://localhost:4000/api/v1'; // ¡Ajusta tu URL de Express!

    // Endpoint de productos
    const API_URL_PRODUCTOS = `${API_BASE_URL}/productos`; 
    const API_URL_CATEGORIAS = `${API_BASE_URL}/categorias`; 

    // ------------------------------------------------------------------
    // FUNCIÓN PARA CARGAR CATEGORÍAS (CRUD: READ)
    // ------------------------------------------------------------------
    useEffect(() => {
        if (!token) return;

        const fetchCategories = async () => {
            try {
                const response = await fetch(API_URL_CATEGORIAS, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setCategories(data);
                    // Opcional: Establecer una categoría por defecto si existen
                    if (data.length > 0) {
                        setFormData(prev => ({ ...prev, categoria_id: data[0].id }));
                    }
                } else {
                    setError('Error al cargar categorías: ' + data.message);
                }
            } catch (err) {
                setError('Error de conexión al cargar categorías.');
            } finally {
                setIsCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, [token]); // Recarga cuando el token esté disponible
    
    // ------------------------------------------------------------------
    // MANEJADORES DE ESTADO
    // ------------------------------------------------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Convertir a número si es necesario para campos numéricos/ID
        const newValue = (name === 'price' || name === 'stock' || name === 'categoria_id') ? (name === 'categoria_id' ? parseInt(value) : parseFloat(value)) : value;
        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    /*const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- NUEVA FUNCIÓN PARA MANEJAR SELECCIÓN DE IMÁGENES ---
    const handleFileChange = (e) => {
        // Obtenemos un array de archivos (permite múltiples)
        setSelectedFiles(Array.from(e.target.files));
    };

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
            // *** CRÍTICO: USAR FormData PARA ENVIAR ARCHIVOS ***
            const dataToUpload = new FormData();
            
            // 1. Agregar los datos del producto
            Object.keys(formData).forEach(key => {
                dataToUpload.append(key, formData[key]);
            });

            // 2. Agregar los archivos de imágenes
            selectedFiles.forEach((file, index) => {
                // Tu backend debe estar configurado para recibir un campo llamado 'images' o 'archivos'
                dataToUpload.append(`images`, file); 
                // dataToUpload.append(`images[${index}]`, file); // Alternativa para array
            });
            // ---------------------------------------------------

            const response = await fetch(API_URL_PRODUCTOS, {
                method: 'POST',
                headers: {
                    // ¡IMPORTANTE! NO establecer 'Content-Type': 'application/json' 
                    // Cuando se usa FormData, el navegador establece 'Content-Type': 'multipart/form-data' automáticamente
                    'Authorization': `Bearer ${token}`, 
                },
                body: dataToUpload, // Enviamos el objeto FormData
            });

            const data = await response.json();

            if (response.ok) {
                alert('Producto y/o imágenes creados exitosamente!');
                router.push('/admin/productos'); 
            } else {
                setError(data.message || 'Error al crear el producto.');
            }
        } catch (err) {
            console.error('Error de conexión:', err);
            setError('No se pudo conectar con el servidor.');
        } finally {
            setIsSubmitting(false);
        }
    };*/

    // ------------------------------------------------------------------
    // SUBMIT DEL FORMULARIO
    // ------------------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        if (!token) {
            setError("Error: Token de autenticación no disponible.");
            setIsSubmitting(false);
            return;
        }

        // Validación de categoría_id
        if (!formData.categoria_id) {
            setError("Debe seleccionar una categoría.");
            setIsSubmitting(false);
            return;
        }

        try {
            const dataToUpload = new FormData();
            
            // 1. Agregar los datos del producto (incluye categoria_id)
            Object.keys(formData).forEach(key => {
                // El campo categoria_id debe ser un número para FormData
                dataToUpload.append(key, formData[key]);
            });

            // 2. Agregar los archivos de imágenes
            selectedFiles.forEach((file) => {
                dataToUpload.append(`images`, file); 
            });

            const response = await fetch(API_URL_PRODUCTOS, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                },
                body: dataToUpload, 
            });

            const data = await response.json();

            if (response.ok) {
                alert('Producto creado exitosamente!');
                router.push('/admin/productos');
            } else {
                setError(data.message || 'Error al crear el producto.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('No se pudo conectar con el servidor.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Si las categorías están cargando, mostramos un mensaje
    if (isCategoriesLoading) {
        return <div style={{ textAlign: 'center', padding: '100px' }}>Cargando categorías...</div>;
    }

    if (error && !isSubmitting) {
        return <div style={{ color: 'red', textAlign: 'center', padding: '100px' }}>Error Crítico: {error}</div>;
    }

    return (
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '20px' }}>Crear Nuevo Producto</h1>
            
            {error && <p style={{ color: 'red', border: '1px solid red', padding: '10px' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={formStyle}>

                {/* --- NUEVO CAMPO DE CATEGORÍA --- */}
                <label style={labelStyle}>
                    Categoría:
                    <select 
                        name="categoria_id" 
                        value={formData.categoria_id} 
                        onChange={handleChange} 
                        required 
                        style={inputStyle}
                    >
                        {categories.length === 0 ? (
                            <option value="">No hay categorías disponibles</option>
                        ) : (
                            categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.nombre}
                                </option>
                            ))
                        )}
                    </select>
                </label>
                {/* --------------------------------- */}
                
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

                {/* --- NUEVO CAMPO DE CARGA DE IMÁGENES --- */}
                <label style={labelStyle}>
                    Imágenes del Producto:
                    <input 
                        type="file" 
                        name="images" 
                        onChange={handleFileChange} 
                        multiple // Permite seleccionar varios archivos
                        accept="image/*" // Solo acepta archivos de imagen
                        style={inputStyle} 
                    />
                    <small style={{ color: '#666', marginTop: '5px' }}>
                        {selectedFiles.length} archivo(s) seleccionado(s).
                        (El primer archivo se considerará la imagen principal)
                    </small>
                </label>
                {/* ------------------------------------------ */}

                <button type="submit" disabled={isSubmitting} style={buttonStyle}>
                    {isSubmitting ? 'Guardando...' : 'Crear Producto'}
                </button>
            </form>
        </div>
    );
}

// ... (Exportaciones y estilos)
const containerStyle = { padding: '40px', maxWidth: '800px', margin: '0 auto' };
const headingStyle = { marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '10px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' };
const labelStyle = { display: 'flex', flexDirection: 'column', fontWeight: 'bold' };
const inputStyle = { padding: '12px', marginTop: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' };
const buttonStyle = { padding: '15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const formErrorStyle = { color: 'red', border: '1px solid red', padding: '10px', borderRadius: '4px', marginBottom: '15px' };


export default function NewProductPage() {
    return (
        <ProtectedRoute requiredRole="admin">
            <NewProductContent />
        </ProtectedRoute>
    );
}
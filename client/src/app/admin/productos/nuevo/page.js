'use client';

import ProtectedRoute from '../../../../components/auth/ProtectedRoute';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// Asumimos que tienes un hook o una función para obtener el JWT del Admin
import { useAuth } from '../../../../context/AuthContext'; 

// Componente para la lógica del formulario
function NewProductContent() {
    const router = useRouter();
    // const { token } = useAuth(); // Necesitas el token para la ruta protegida
    // --- NUEVO ESTADO PARA MANEJAR ARCHIVOS ---
    const [selectedFiles, setSelectedFiles] = useState([]);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_URL = 'http://localhost:4000/api/v1/productos'; // ¡Ajusta tu URL de Express!

    const handleChange = (e) => {
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
    };

    return (
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '20px' }}>Crear Nuevo Producto</h1>
            
            {error && <p style={{ color: 'red', border: '1px solid red', padding: '10px' }}>{error}</p>}
            
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

// Estilos básicos (puedes moverlos a CSS)
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' };
const labelStyle = { display: 'flex', flexDirection: 'column', fontWeight: 'bold' };
const inputStyle = { padding: '10px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' };
const buttonStyle = { padding: '12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' };


export default function NewProductPage() {
    return (
        <ProtectedRoute requiredRole="admin">
            <NewProductContent />
        </ProtectedRoute>
    );
}
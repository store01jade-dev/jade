'use client';

import Image from 'next/image';
//import NextImage from 'next/image';
import ProtectedRoute from '../../../../components/auth/ProtectedRoute';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import style from "./NuevoProducto.module.css"; 
import VariantesInput from '../../variantes/VariantesInput';

// Componente para la lógica del formulario
function NewProductContent() {
    const router = useRouter();
    const { token } = useAuth(); // Necesitas el token para la ruta protegida
    // --- NUEVO ESTADO PARA MANEJAR ARCHIVOS ---
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [mainImageIndex, setMainImageIndex] = useState(0); //estado: Índice de la imagen principal
    // --- NUEVOS ESTADOS PARA CATEGORÍAS ---
    const [categorias, setCategorias] = useState([]);
    const [isCategoriasLoading, setIsCategoriasLoading] = useState(true);
    
    
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio_base: '',
        activo: true,
        categoria_id: '', // <-- Campo para el ID de la categoría
        variantes: [],
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // ¡Ajusta tu URL de Express!

    // Endpoint de productos
    const API_URL_PRODUCTOS = `${API_BASE_URL}/api/v1/productos`; 
    const API_URL_CATEGORIAS = `${API_BASE_URL}/api/v1/categorias`; 

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
                    setCategorias(data);
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
                setIsCategoriasLoading(false);
            }
        };

        fetchCategories();
    }, [token]); // Recarga cuando el token esté disponible
    
    // ------------------------------------------------------------------
    // MANEJADORES DE ESTADO
    // ------------------------------------------------------------------
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        let newValue;
        if(name === 'precio_base'){
            newValue = value === '' ? '' : parseFloat(value);
        } else if (type === 'checkbox') {
            newValue = checked; // Para el campo 'activo'
        } else if (name === 'categoria_id') {
            newValue = parseInt(value);
        } else {
            newValue = value;
        }

        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    /*const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };*/

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


    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
        // Resetea el índice principal si no hay archivos
        setMainImageIndex(files.length > 0 ? 0 : null); 
    };

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
                if (key === 'variantes') {
                    dataToUpload.append(key, JSON.stringify(formData[key])); 
                } else if (key === 'activo') {
                    // CRÍTICO: Convertir el booleano a string ('true' o 'false') para FormData
                    dataToUpload.append(key, formData[key].toString()); 
                } else {
                    dataToUpload.append(key, formData[key]);
                }
            });

            // 2. Agregar los archivos de imágenes
            selectedFiles.forEach((file, index) => {
                dataToUpload.append(`images`, file); 
                // AÑADIR LA BANDERA PRINCIPAL
                if (index === mainImageIndex) {
                    // Envía un indicador para el Backend que debe ser 'true' para la principal
                    dataToUpload.append(`isPrincipal`, 'true'); 
                } else {
                    dataToUpload.append(`isPrincipal`, 'false');
                }
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
    if (isCategoriasLoading) {
        return <div style={{ textAlign: 'center', padding: '100px' }}>Cargando categorías...</div>;
    }

    if (error && !isSubmitting) {
        return <div style={{ color: 'red', textAlign: 'center', padding: '100px' }}>Error Crítico: {error}</div>;
    }

    return (
        <div className={style.container}>
            {/* ... heading y error ... */}
            
            <form onSubmit={handleSubmit} className={style.form}>
                
                {/* CATEGORÍA */}
                <label className={style.label}>
                    Categoría:
                    <select 
                        id="categoria" 
                        name="categoria_id" 
                        value={formData.categoria_id} 
                        onChange={handleChange}
                        className={style.select} // 📌 USO CORRECTO DE .select
                    >
                        {/* ... options ... */}
                        <option value="">Selecciona una categoría</option>

                        {categorias.map((cat) => (
                            <option 
                                key={cat.id} 
                                value={cat.id} // El valor debe ser el ID (número)
                            >
                                {cat.nombre} {/* Mostrar el nombre */}
                            </option>
                        ))}

                    </select>
                </label>

                {/* NOMBRE */}
                <label className={style.label}>
                    Nombre:
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className={style.input} />
                </label>

                {/* DESCRIPCIÓN */}
                <label className={style.label}>
                    Descripción:
                    <textarea 
                        name="descripcion" 
                        value={formData.descripcion} 
                        onChange={handleChange} 
                        required 
                        rows="4" 
                        className={style.textarea} // 📌 USO CORRECTO DE .textarea
                    ></textarea>
                </label>

                {/* PRECIO */}
                <label className={style.label}>
                    Precio ($):
                    <input type="number" name="precio_base" value={formData.precio_base} onChange={handleChange} required={formData.variantes.length === 0} min="0.01" step="0.01" className={style.input} />
                </label>

                {/* ACTIVO/VISIBLE */}
                <label className={style.checkboxLabel}>
                    <input 
                        type="checkbox" 
                        name="activo" 
                        checked={formData.activo} 
                        onChange={handleChange} 
                        className={style.checkboxInput} />

                    Producto Activo / Visible
                </label>

                {/* VARIANTES INPUT */}
                {/* VARIANTES INPUT - (Este componente VariantesInput.js también debería usar CSS Modules) */}
                <VariantesInput
                    variantes={formData.variantes} 
                    setVariantes={(v) => setFormData(prev => ({ ...prev, variantes: v }))}  
                />
                
                {/* IMÁGENES */}
                <label className={style.label}>
                    Imágenes del Producto:
                    <input type="file" name="images" onChange={handleFileChange} multiple accept="image/*" className={style.input} />

                    {/* NUEVO BLOQUE DE PREVISUALIZACIÓN */}
                    {selectedFiles.length > 0 && (
                        <div className={style.imagePreviewContainer}>
                            <h4 style={{ marginBottom: '10px' }}>Selecciona la Imagen Principal:</h4>
                            <div className={style.imageGrid}>
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className={`${style.imageItem} ${index === mainImageIndex ? style.mainImage : ''}`}>
                                        <Image 
                                            src={URL.createObjectURL(file)} 
                                            alt={`Previsualización ${index + 1}`} 
                                            width={100} 
                                            height={100} 
                                            style={{ objectFit: 'cover' }}
                                        />
                                        <button 
                                            type="button"
                                            className={style.selectMainButton}
                                            onClick={() => setMainImageIndex(index)}
                                        >
                                            {index === mainImageIndex ? 'Principal' : 'Elegir'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <small style={{ color: '#666', marginTop: '5px' }}>
                        {selectedFiles.length} archivo(s) seleccionado(s).
                    </small>
                </label>
                
                {/* BOTÓN DE SUBMIT */}
                <button type="submit" disabled={isSubmitting} className={style.button}>
                    {isSubmitting ? 'Creando...' : 'Crear Producto'}
                </button>
            </form>
        </div>
    );
}



export default function NewProductPage() {
    return (
        <ProtectedRoute requiredRole="admin">
            <NewProductContent />
        </ProtectedRoute>
    );
}
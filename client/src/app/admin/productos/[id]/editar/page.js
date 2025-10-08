'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../../context/AuthContext';
import ProtectedRoute from '../../../../../components/auth/ProtectedRoute'; 
import VariantesInput from '../../../../../app/admin/variantes/VariantesInput'; 
import style from '../../nuevo/NuevoProducto.module.css'; // Reutilizamos los estilos

const API_BASE_URL = 'http://localhost:4000/api/v1'; 

function EditProductContent() {
    const router = useRouter();
    const params = useParams(); // Para obtener el ID de la URL
    const { token } = useAuth();
    const productId = params.id; // ID del producto a editar

    const [categories, setCategories] = useState([]);
    const [originalImages, setOriginalImages] = useState([]); // Imágenes que ya están en la DB
    const [selectedFiles, setSelectedFiles] = useState([]); // Nuevas imágenes a subir
    
    // Estado inicial que cargaremos con los datos del producto
    const [formData, setFormData] = useState({
        nombre: '', 
        descripcion: '', 
        precio: '', 
        categoria_id: '', 
        activo: true,
        variantes: [],
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_URL_PRODUCTO = `${API_BASE_URL}/productos/${productId}`;
    const API_URL_CATEGORIAS = `${API_BASE_URL}/categorias`;

    // ------------------------------------------------------------------
    // 1. CARGA INICIAL: Producto y Categorías
    // ------------------------------------------------------------------
    useEffect(() => {
        if (!token || !productId) return;

        const fetchData = async () => {
            setError(null);
            setIsLoading(true);
            try {
                // Fetch de Categorías
                const [productRes, categoriesRes] = await Promise.all([
                    fetch(API_URL_PRODUCTO, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(API_URL_CATEGORIAS, { headers: { 'Authorization': `Bearer ${token}` } }),
                ]);

                const productData = await productRes.json();
                const categoriesData = await categoriesRes.json();

                if (!categoriesRes.ok) {
                    throw new Error(categoriesData.message || 'Error al cargar categorías.');
                }
                setCategories(categoriesData);

                if (!productRes.ok) {
                    throw new Error(productData.message || 'Error al cargar el producto.');
                }
                
                // CRÍTICO: Mapear los datos de la DB al estado del formulario
                setFormData({
                    nombre: productData.nombre || '',
                    descripcion: productData.descripcion || '',
                    precio: parseFloat(productData.precio) || 0,
                    categoria_id: productData.categoria_id || (categoriesData.length > 0 ? categoriesData[0].id : ''),
                    activo: productData.activo || false,
                    // Asegúrate de que las variantes existan y sean un array
                    variantes: productData.variantes || [], 
                });
                
                // Guardar imágenes originales para mostrarlas
                setOriginalImages(productData.imagenes || []); 

            } catch (err) {
                console.error("Error en fetchData:", err.message);
                setError(err.message || 'Error de conexión al cargar datos.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [token, productId]);
    
    // ------------------------------------------------------------------
    // 2. MANEJADORES DE ESTADO (Reutilizados de crearProducto)
    // ------------------------------------------------------------------
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        let newValue;
        if (type === 'checkbox') {
            newValue = checked; 
        } else if (name === 'precio' || name === 'categoria_id') {
            // Manejamos precio y categoria_id como números
            newValue = name === 'categoria_id' ? parseInt(value) : parseFloat(value);
        } else {
            newValue = value;
        }

        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleFileChange = (e) => {
        // Al editar, esto añade nuevas imágenes a la cola
        setSelectedFiles(Array.from(e.target.files));
    };

    // Función para eliminar una imagen que ya existe en la DB (Opcional)
    const handleRemoveOriginalImage = (imageId) => {
        // Lógica de eliminación de imagen. Esto requeriría un nuevo endpoint: DELETE /api/v1/productos/:id/imagenes/:imageId
        alert(`Implementar endpoint DELETE para la imagen ID: ${imageId}`);
    };

    // ------------------------------------------------------------------
    // 3. SUBMIT DEL FORMULARIO (Actualización)
    // ------------------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        // ... (Validaciones) ...

        try {
            const dataToUpload = new FormData();
            
            // 1. Agregar datos del producto (con la corrección para 'activo' y 'variantes')
            Object.keys(formData).forEach(key => {
                if (key === 'variantes') {
                    // Stringify el array de variantes
                    dataToUpload.append(key, JSON.stringify(formData[key])); 
                } else if (key === 'activo') {
                    // Convertir booleano a string para FormData
                    dataToUpload.append(key, formData[key].toString()); 
                } else {
                    dataToUpload.append(key, formData[key]);
                }
            });

            // 2. Agregar los archivos de imágenes (nuevos)
            selectedFiles.forEach((file) => {
                dataToUpload.append(`images`, file); 
            });
            
            // 3. CRÍTICO: Usar el método PUT para actualizar
            const response = await fetch(API_URL_PRODUCTO, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                },
                body: dataToUpload, 
            });

            const data = await response.json();

            if (response.ok) {
                alert('Producto actualizado exitosamente!');
                router.push('/admin/productos');
            } else {
                setError(data.message || 'Error al actualizar el producto.');
            }
        } catch (err) {
            console.error('Update error:', err);
            setError('No se pudo conectar con el servidor.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className={style.container} style={{textAlign: 'center'}}>Cargando datos del producto...</div>;
    
    if (error && !isSubmitting) return <div className={`${style.container} ${style.error}`}>Error al cargar: {error}</div>;

    // ------------------------------------------------------------------
    // 4. Renderizado del Formulario (Similar a crearProducto)
    // ------------------------------------------------------------------
    return (
        <div className={style.container}> 
            <h1 className={style.heading}>Editar Producto ID: {productId}</h1>
            
            {error && <p className={style.error}>{error}</p>}
            
            <form onSubmit={handleSubmit} className={style.form}> 
                
                {/* CATEGORÍA */}
                <label className={style.label}>
                    Categoría:
                    <select name="categoria_id" value={formData.categoria_id} onChange={handleChange} required className={style.select}> 
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </select>
                </label>

                {/* NOMBRE, DESCRIPCIÓN, PRECIO */}
                {/* ... (Usar campos name="nombre", name="descripcion", name="precio") ... */}

                {/* ACTIVO/VISIBLE */}
                <label className={style.checkboxLabel}> 
                    <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} className={style.checkboxInput} />
                    Producto Activo / Visible
                </label>

                {/* VARIANTES INPUT */}
                <VariantesInput 
                    variantes={formData.variantes} 
                    setVariantes={(v) => setFormData(prev => ({ ...prev, variantes: v }))} 
                />
                
                {/* IMÁGENES EXISTENTES (Para referencia y eliminación) */}
                <div style={{marginBottom: '20px', borderTop: '1px solid #eee', paddingTop: '15px'}}>
                    <h3 style={{marginBottom: '10px'}}>Imágenes Actuales ({originalImages.length})</h3>
                    {originalImages.map(img => (
                        <div key={img.id} style={{display: 'inline-block', marginRight: '10px'}}>
                            {/*  // Descomentar si usas un servicio */}
                            <img src={img.url} alt={`Imagen ${img.id}`} width="100" height="100" style={{objectFit: 'cover'}} />
                            <button type="button" onClick={() => handleRemoveOriginalImage(img.id)} style={{color: 'red', border: 'none', background: 'none', cursor: 'pointer'}}>X</button>
                        </div>
                    ))}
                </div>

                {/* NUEVAS IMÁGENES */}
                <label className={style.label}>
                    Cargar Nuevas Imágenes:
                    <input type="file" name="images" onChange={handleFileChange} multiple accept="image/*" className={style.input} />
                    <small style={{ color: '#666', marginTop: '5px' }}>{selectedFiles.length} archivo(s) nuevo(s) en cola.</small>
                </label>
                
                {/* BOTÓN DE SUBMIT */}
                <button type="submit" disabled={isSubmitting} className={style.button}>
                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </form>
        </div>
    );
}

export default function EditProductPage() {
    return (
        <ProtectedRoute requiredRole="admin">
            <EditProductContent />
        </ProtectedRoute>
    );
}
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../../context/AuthContext';
import ProtectedRoute from '../../../../../components/auth/ProtectedRoute'; 
import VariantesInput from '../../../../../app/admin/variantes/VariantesInput'; 
import style from '../../nuevo/NuevoProducto.module.css'; // Reutilizamos los estilos

const API_BASE_URL = 'http://localhost:4000/api/v1'; 
const BASE_URL_API = 'http://localhost:4000'

function EditProductContent() {
    const router = useRouter();
    const params = useParams(); // Para obtener el ID de la URL
    const { token } = useAuth();
    const productId = params.id; // ID del producto a editar

    const [categories, setCategories] = useState([]);
    const [originalImages, setOriginalImages] = useState([]); // Imágenes que ya están en la DB
    const [mainImageKey, setMainImageKey] = useState(null); // Identificador de la imagen principal
    const [selectedFiles, setSelectedFiles] = useState([]); // Nuevas imágenes a subir
    
    // Estado inicial que cargaremos con los datos del producto
    const [formData, setFormData] = useState({
        nombre: '', 
        descripcion: '', 
        precio_base: '', 
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

                // Limpieza y mapeo de variantes antes de asignar al estado
                const cleanedVariantes = (productData.variantes || []).map(v => ({
                    // Si el valor es null/undefined, usa '' o 0 según el tipo
                    id: v.id || null, // Mantener el ID si existe
                    sku: v.sku || '',             // <-- CRÍTICO: Usar '' si es null
                    talla: v.talla || '',         // Usar '' si es null
                    color: v.color || '',         // Usar '' si es null
                    stock: v.stock || 0,
                    precio: parseFloat(v.precio) || 0,
                    peso: parseFloat(v.peso) || 0,
                    // ... incluir otros campos de variante si existen
                }));

                const existingImages = productData.imagenesProducto || [];
                
                // CRÍTICO: Mapear los datos de la DB al estado del formulario
                setFormData({
                    nombre: productData.nombre || '',
                    descripcion: productData.descripcion || '',
                    precio_base: parseFloat(productData.precio_base) || 0,
                    categoria_id: productData.categoria_id || (categoriesData.length > 0 ? categoriesData[0].id : ''),
                    activo: productData.activo || false,
                    // Asegúrate de que las variantes existan y sean un array
                    variantes: cleanedVariantes, 
                });
                
                // Guardar imágenes originales para mostrarlas
                setOriginalImages(existingImages);
                // Ajustar la inicialización de imágenes para definir el mainImageKey inicial
                // Dentro de fetchData, después de setOriginalImages:
                const principalImg = existingImages.find(img => img.principal === true);
                if (principalImg) {
                    setMainImageKey(`existing-${principalImg.id}`); // Formato: existing-{ID}
                } 

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
        // 📌 CORRECCIÓN: Usar precio_base y manejar el string vacío
        } else if (name === 'precio_base') { 
            newValue = value === '' ? '' : parseFloat(value);
        } else if (name === 'categoria_id') {
            newValue = parseInt(value);
        } else {
            newValue = value;
        }

        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleFileChange = (e) => {
        // Al editar, esto añade nuevas imágenes a la cola
        setSelectedFiles(Array.from(e.target.files));
    };

    // Función para eliminar una imagen que ya existe en la DB (quitándola del estado)
    const handleRemoveOriginalImage = (imageId) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta imagen? Se borrará al guardar los cambios.')) return;
        
        // La imagen se elimina del estado `originalImages`
        setOriginalImages(prevImages => prevImages.filter(img => img.id !== imageId));
        
        // El Backend recibirá la lista reducida de IDs a mantener y borrará la que falta.
    };

    // Función para marcar una imagen (existente o nueva) como principal
    const setAsMainImage = (key) => {
        setMainImageKey(key);
    };

    // ------------------------------------------------------------------
    // 3. SUBMIT DEL FORMULARIO (Actualización)
    // ------------------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        // ... (Validaciones) ...
        console.log("El estado mainImageKey al hacer submit es:", mainImageKey);

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
                dataToUpload.append(`newImages`, file); 
            });

            // CRÍTICO: Enviar los IDs de las imágenes que DEBEN PERMANECER en la DB.
            // Las que no estén en esta lista serán eliminadas por el Backend.
            const imagesToKeepIds = originalImages.map(img => img.id);
            dataToUpload.append('existingImageIds', JSON.stringify(imagesToKeepIds));

            
            dataToUpload.append('mainImageKey', mainImageKey || ''); // Envía la clave

            // 3. CRÍTICO: Usar el método PATCH para actualizar
            const response = await fetch(API_URL_PRODUCTO, {
                method: 'PATCH', // USAR PATCH (no PUT) para actualización parcial con FormData
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    // ;NO USAR Content-Type: 'application/json'
                },
                body: dataToUpload, 
            });

            const data = await response.json();

            console.log("Respuesta del Backend - Lista de Imágenes:", data.imagenesProducto);

            if (response.ok) {
                alert('Producto actualizado exitosamente!');

                // 1. Re-inicializar OriginalImages para forzar el re-renderizado
                const updatedImages = data.imagenesProducto || [];
                setOriginalImages(updatedImages);

                // 2. Recalcular el mainImageKey a partir de la nueva data del Backend
                const principalImg = updatedImages.find(img => img.principal === true);
                console.log("Imagen principal reportada por el Backend:", principalImg);
                
                if (principalImg) {
                    // CRÍTICO: El nuevo principal debe ser el que acabamos de guardar
                    setMainImageKey(`existing-${principalImg.id}`);
                    console.log("Nueva clave principal establecida:", `existing-${principalImg.id}`); 
                } else {
                    // Si por alguna razón no hay principal (ej. se eliminó el único principal), resetear
                    setMainImageKey(null);
                }
                
                // 3. Opcional: Recargar la página (o redirigir) si el cambio es global
                //Ejecutar la redirección (router.replace no devuelve promesa)
                router.replace('/admin/productos'); 
                
                // 2. Forzar la recarga de la ventana después de un breve retraso 
                //    para dar tiempo a que la redirección se inicie.
                // Esto asegura que se anule la caché del navegador.
                setTimeout(() => {
                    window.location.reload(); 
                }, 100); // 100 milisegundos es suficiente
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

                {/* CRÍTICO: REINTRODUCIR CAMPO NOMBRE */}
                <label className={style.label}>
                    Nombre:
                    <input 
                        type="text" 
                        name="nombre" 
                        value={formData.nombre} 
                        onChange={handleChange} 
                        required 
                        className={style.input} 
                    />
                </label>

                {/* CRÍTICO: REINTRODUCIR CAMPO DESCRIPCIÓN */}
                <label className={style.label}>
                    Descripción:
                    <textarea 
                        name="descripcion" 
                        value={formData.descripcion} 
                        onChange={handleChange} 
                        required 
                        rows="4" 
                        className={style.input}
                    ></textarea>
                </label>

                {/* CRÍTICO: REINTRODUCIR CAMPO PRECIO */}
                <label className={style.label}>
                    Precio ($):
                    <input type="number" name="precio_base" value={formData.precio_base} onChange={handleChange} required={formData.variantes.length === 0} min="0.01" step="0.01" className={style.input} />
                </label>

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
                    
                    {/* 📌 ELIMINA EL PRIMER BLOQUE DUPLICADO Y SOLO USA ESTE: */}
                    {originalImages.map(img => {
                        const key = `existing-${img.id}`;
                        const isMain = mainImageKey === key;
                        return (
                            <div key={img.id} style={{display: 'inline-block', marginRight: '10px', position: 'relative'}}>
                                
                                {/* 1. CONCATENACIÓN CRÍTICA DE LA URL */}
                                <Image 
                                    src={`${BASE_URL_API}${img.url}`} // Esto debe mostrar la imagen
                                    alt={`Imagen ${img.id}`} 
                                    width="100" 
                                    height="100" 
                                    style={{objectFit: 'cover'}} 
                                />

                                {/* Botón/Indicador de Principal */}
                                <button 
                                    type="button" 
                                    onClick={() => setAsMainImage(key)} // Llama al handler con la clave
                                    style={{
                                        position: 'absolute', 
                                        bottom: 0, 
                                        left: 0, 
                                        width: '100%', 
                                        backgroundColor: isMain ? '#007bff' : 'rgba(0,0,0,0.6)', 
                                        color: 'white',
                                        padding: '5px',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                    title={isMain ? "Principal" : "Establecer como principal"}
                                >
                                    {isMain ? '★ Principal' : 'Hacer Principal'}
                                </button>
                                
                                {/* 2. BOTÓN DE ELIMINACIÓN */}
                                <button 
                                    type="button" 
                                    onClick={() => handleRemoveOriginalImage(img.id)} 
                                    style={{
                                        position: 'absolute', // Permite posicionar el botón encima de la imagen
                                        top: 0,
                                        right: 0,
                                        color: 'white', 
                                        backgroundColor: 'rgba(220, 53, 69, 0.8)', // Rojo semi-transparente
                                        border: 'none', 
                                        cursor: 'pointer',
                                        borderRadius: '0 0 0 5px',
                                        padding: '3px 6px',
                                        fontWeight: 'bold'
                                    }}>
                                    X
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* NUEVAS IMÁGENES */}
                <label className={style.label}>
                    Cargar Nuevas Imágenes:
                    <input type="file" name="images" onChange={handleFileChange} multiple accept="image/*" className={style.input} />
                    <small style={{ color: '#666', marginTop: '5px' }}>{selectedFiles.length} archivo(s) nuevo(s) en cola.</small>
                </label>

                <input 
                    type="hidden" 
                    name="mainImageKey" 
                    value={mainImageKey || ''} 
                    readOnly
                />
                
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
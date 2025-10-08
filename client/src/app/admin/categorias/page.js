'use client';

import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
// Importamos un módulo de estilos que crearemos para esta página
import styles from './Categorias.module.css'; 

const API_CATEGORIAS = 'http://localhost:4000/api/v1/categorias';

function CategoryManagementContent() {
    const { token } = useAuth();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ nombre: '', imagen_url: '' });
    const [editingCategory, setEditingCategory] = useState(null); // Estado para editar
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ----------------------------------------------------
    // CRUD: READ (Cargar Categorías)
    // ----------------------------------------------------
    const fetchCategories = async () => {
        if (!token) {
            setError('Token no disponible.');
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(API_CATEGORIAS, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setCategories(data);
            } else {
                setError(data.message || 'Error al cargar categorías.');
            }
        } catch (err) {
            setError('Error de conexión con el servidor.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchCategories();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ----------------------------------------------------
    // CRUD: CREATE & UPDATE (Manejar Formulario)
    // ----------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const method = editingCategory ? 'PUT' : 'POST';
        const url = editingCategory ? `${API_CATEGORIAS}/${editingCategory.id}` : API_CATEGORIAS;

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Categoría ${editingCategory ? 'actualizada' : 'creada'} con éxito.`);
                setFormData({ nombre: '', imagen_url: '' });
                setEditingCategory(null); // Terminar la edición
                fetchCategories(); // Recargar la lista
            } else {
                setError(data.message || `Error al ${editingCategory ? 'actualizar' : 'crear'} la categoría.`);
            }
        } catch (err) {
            setError('Error de conexión.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ----------------------------------------------------
    // CRUD: DELETE (Eliminar Categoría)
    // ----------------------------------------------------
    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta categoría? Esto podría fallar si hay productos asociados.')) return;

        try {
            const response = await fetch(`${API_CATEGORIAS}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || 'Categoría eliminada.');
                fetchCategories();
            } else {
                setError(data.message || 'Error al eliminar. Verifique si hay productos asociados.');
            }
        } catch (err) {
            setError('Error de conexión al eliminar.');
        }
    };

    // Iniciar el modo de edición
    const startEdit = (category) => {
        setEditingCategory(category);
        setFormData({ nombre: category.nombre, imagen_url: category.imagen_url || '' });
    };

    if (isLoading) return <div className={styles.loading}>Cargando categorías...</div>;
    
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Gestión de Categorías</h1>

            {/* Formulario de Creación/Edición */}
            <div className={styles.formSection}>
                <h2 className={styles.subHeading}>
                    {editingCategory ? 'Editar Categoría' : 'Crear Nueva Categoría'}
                </h2>
                {error && <p className={styles.error}>{error}</p>}
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label className={styles.label}>
                        Nombre:
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className={styles.input} />
                    </label>

                    <label className={styles.label}>
                        URL de Imagen (Opcional):
                        <input type="url" name="imagen_url" value={formData.imagen_url} onChange={handleChange} className={styles.input} placeholder="http://example.com/imagen.jpg" />
                    </label>

                    <div className={styles.buttonGroup}>
                        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                            {isSubmitting ? 'Guardando...' : editingCategory ? <><FaEdit /> Guardar Cambios</> : <><FaPlus /> Crear Categoría</>}
                        </button>
                        
                        {editingCategory && (
                            <button type="button" onClick={() => { setEditingCategory(null); setFormData({ nombre: '', imagen_url: '' }); }} className={styles.cancelButton}>
                                <FaTimes /> Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <hr className={styles.separator} />

            {/* Listado de Categorías */}
            <h2 className={styles.subHeading}>Lista de Categorías Existentes ({categories.length})</h2>
            
            {categories.length === 0 ? (
                <p>No hay categorías creadas. Usa el formulario de arriba.</p>
            ) : (
                <div className={styles.listContainer}>
                    {categories.map((category) => (
                        <div key={category.id} className={styles.categoryItem}>
                            <span className={styles.categoryName}>{category.nombre}</span>
                            <div className={styles.actions}>
                                <button onClick={() => startEdit(category)} className={styles.actionButton}>
                                    <FaEdit />
                                </button>
                                <button onClick={() => handleDelete(category.id)} className={styles.deleteButton}>
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function CategoryManagementPage() {
    return (
        <ProtectedRoute requiredRole="admin">
            <CategoryManagementContent />
        </ProtectedRoute>
    );
}
'use client';

import React, { useState, useEffect } from 'react';
import styles from './Filtros.module.css'; 


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Filtros({ filtros, setFiltros }) {
    
    // ESTADO LOCAL: Mantiene los cambios del usuario sin activar la búsqueda
    const [localFiltros, setLocalFiltros] = useState(filtros);
    const [categorias, setCategorias] = useState([]);
    
    // Sincroniza el estado local cuando los filtros externos cambian (ej. al cargar la página con URL params)
    useEffect(() => {
        setLocalFiltros(filtros);
    }, [filtros]);

    // Cargar las categorías desde la API
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await fetch(`${API_URL}/api/v1/categorias`);
                if (response.ok) {
                    const data = await response.json();
                    setCategorias(data);
                }
            } catch (error) {
                console.error("Error cargando categorías:", error);
            }
        };
        fetchCategorias();
    }, []);

    // FUNCIÓN DE APLICAR FILTROS
    const handleAplicarFiltros = () => {
        // Solo cuando se hace clic, actualizamos el estado externo,
        // lo que dispara la nueva búsqueda en el componente padre.
        setFiltros(localFiltros);
        // Si la búsqueda por nombre estaba activa, la limpiamos.
        // Esto asegura que el campo se vacíe visualmente después de aplicar el filtro.
        if (localFiltros.nombre.trim() !== '') {
            // Creamos un nuevo objeto de filtros locales con el nombre vacío,
            // pero mantenemos los otros filtros (categoría, precios)
            setLocalFiltros({
                ...localFiltros,
                nombre: '' // Borra el término de búsqueda
            });
        }
    };

    // esta funcion maneja la pulsación de teclas
    const handleKeyDown = (e) => {
        // Verifica si la tecla presionada es "Enter" (código 'Enter')
        if (e.key === 'Enter') {
            e.preventDefault(); // Evita el comportamiento predeterminado del formulario (si lo hubiera)
            handleAplicarFiltros(); // Llama a la función que inicia la búsqueda
        }
    };

    // FUNCIÓN DE LIMPIAR FILTROS
    const handleLimpiarFiltros = () => {
        const filtrosIniciales = {
            nombre: '',
            categoria: '',
            precioMin: 0,
            precioMax: 1000, // Ajusta este valor si tu máximo es diferente
        };
        setLocalFiltros(filtrosIniciales);
        setFiltros(filtrosIniciales); // Aplica la limpieza inmediatamente
    };
  
    return (
        <div className={styles.filtrosContainer}>
            <h4 className="text-lg font-semibold mb-3">Filtros de Búsqueda</h4>
            
            <div className={styles.filtrosInnerWrapper}> 
                
                {/* Filtro por Nombre */}
                <div className={styles.filtroItem}>
                    <label htmlFor="nombre">Nombre del Producto</label>
                    <input
                        type="text"
                        id="nombre"
                        value={localFiltros.nombre} // Usamos estado local
                        onChange={(e) => setLocalFiltros({...localFiltros, nombre: e.target.value})} // Actualiza estado local
                        onKeyDown={handleKeyDown}
                        className={styles.inputField}
                        placeholder="Buscar por nombre..."
                    />
                </div>
                
                {/* Filtro por Categoría */}
                <div className={styles.filtroItem}>
                    <label htmlFor="categoria">Categoría</label>
                    <select
                        id="categoria"
                        value={localFiltros.categoria}
                        onChange={(e) => setLocalFiltros({...localFiltros, categoria: e.target.value})}
                        className={styles.inputField}
                    >
                        {/* Opción por defecto para mostrar todos los productos */}
                        <option value="">Todas las categorías</option>
                        
                        {/* Renderizado dinámico de categorías desde la base de datos */}
                        {categorias.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                
                {/* Filtros por Precio */}
                <div className={styles.precioRangeWrapper}> 
                    <div className={styles.filtroItem}>
                        <label htmlFor="precioMin">Precio Mínimo</label>
                        <input
                            type="number"
                            id="precioMin"
                            value={localFiltros.precioMin}
                            // Asegura que el valor sea un número o cero
                            onChange={(e) => setLocalFiltros({...localFiltros, precioMin: parseFloat(e.target.value) || 0})}
                            className={styles.inputField}
                            min="10.000"
                            max="500.000"
                        />
                    </div>
                    <div className={styles.filtroItem}>
                        <label htmlFor="precioMax">Precio Máximo</label>
                        <input
                            type="number"
                            id="precioMax"
                            value={localFiltros.precioMax}
                            // Asegura que el valor sea un número o un valor por defecto alto
                            onChange={(e) => setLocalFiltros({...localFiltros, precioMax: parseFloat(e.target.value) || 1000})}
                            className={styles.inputField}
                            min="10.000"
                            max="500.000"
                        />
                    </div>
                </div>
                
                {/* 📌 NUEVOS BOTONES DE ACCIÓN */}
                <div className={styles.actionButtons}>
                    <button 
                        onClick={handleAplicarFiltros} 
                        className={styles.aplicarBtn}
                    >
                        Aplicar Filtros
                    </button>
                    <button 
                        onClick={handleLimpiarFiltros} 
                        className={styles.limpiarBtn}
                    >
                        Limpiar
                    </button>
                </div>
            </div>
        </div>
    );
}

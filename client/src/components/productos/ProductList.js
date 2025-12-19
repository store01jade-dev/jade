// src/components/productos/ProductList.js

'use client'; 

import React, { useState, useEffect, useCallback } from 'react';
import CardSimple from './CardSimple';
import Filtros from './Filtros';
import style from './ProductList.module.css';

const API_BASE_URL = 'http://localhost:4000/api/v1'; 

// 📌 NOTA: Asegúrate de que los valores iniciales coincidan con los límites del input en Filtros.js
const DEFAULT_PRECIO_MIN = 10000;
const DEFAULT_PRECIO_MAX = 500000; 

export default function ProductList() {
  const [productos, setProductos] = useState([]);
  const [filtros, setFiltros] = useState({
    nombre: '',
    categoria: '', 
    precioMin: DEFAULT_PRECIO_MIN, // 📌 Ajustado a 10000
    precioMax: DEFAULT_PRECIO_MAX, // 📌 Ajustado a 500000
  });
  const [isLoading, setIsLoading] = useState(true);
  const [categorias, setCategorias] = useState([]); 

  // Función para obtener la lista de productos basada en los filtros
  const fetchProductos = useCallback(async () => {
    setIsLoading(true);
    
    // 1. Construir la Query String (URLSearchParams)
    const params = new URLSearchParams();
    
    // 2. FILTRO NOMBRE: Solo enviar si hay un valor que no sean espacios vacíos
    if (filtros.nombre.trim()) { 
        params.append('nombre', filtros.nombre.trim());
    }
    
    // 3. FILTRO CATEGORÍA
    if (filtros.categoria) {
        params.append('categoria_id', filtros.categoria);
    }
    
    // 4. FILTRO PRECIO MIN: Solo enviar si el valor es diferente al valor inicial (10000)
    // Usamos parseFloat para manejar el caso de que el valor sea string
    if (parseFloat(filtros.precioMin) !== DEFAULT_PRECIO_MIN) {
        params.append('precioMin', filtros.precioMin);
    }
    
    // 5. FILTRO PRECIO MAX: Solo enviar si el valor es diferente al valor inicial (500000)
    // 📌 CORRECCIÓN: Esta condición estaba mal y causaba el Error 500 al enviar datos inesperados
    if (parseFloat(filtros.precioMax) !== DEFAULT_PRECIO_MAX) {
        params.append('precioMax', filtros.precioMax);
    }
    
    const queryString = params.toString(); // Línea 36: Ahora construida con datos validados
    const url = `${API_BASE_URL}/productos?${queryString}`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        // Mejorar el mensaje de error para debug del Backend
        const errorDetail = await response.json().catch(() => ({ message: 'Respuesta sin JSON.' }));
        throw new Error(`Error ${response.status}: Fallo al obtener productos. Detalle: ${errorDetail.message}`);
      }
      
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error fetching productos:", error);
      setProductos([]); 
    } finally {
      setIsLoading(false);
    }
  }, [filtros]);

  // Función para obtener las categorías (solo una vez)
  useEffect(() => {
    const fetchCategorias = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/categorias`);
            const data = await response.json();
            setCategorias(data);
        } catch (error) {
            console.error("Error fetching categorías:", error);
        }
    };
    fetchCategorias();
  }, []);

  // 2. Ejecutar fetchProductos cuando cambian los filtros
  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]); 

  if (isLoading) return <div className="text-center py-10">Cargando productos...</div>;

  // ... (Resto del return) ...
  return (
    <div className={style.catalogoWrapper}>
      <Filtros
        filtros={filtros}
        setFiltros={setFiltros}
        categorias={categorias}
      />
      <div className={style.productosGrid}>
        {productos.length > 0 ? (
          <>
            {productos.map(producto => (
              // Usar CardSimple o CarouselCard según prefieras
              <CardSimple key={producto.id} producto={producto} /> 
            ))}
          </>
        ) : (
          <p className="text-center text-xl text-gray-600">
            No se encontraron productos que coincidan con los filtros.
          </p>
        )}
      </div>
    </div>
  );
}
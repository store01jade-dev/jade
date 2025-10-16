// src/components/productos/ProductList.js

'use client'; // 📌 1. Convertir a Componente Cliente

import React, { useState, useEffect, useCallback } from 'react';
import CardSimple from './CardSimple'; // Usamos CardSimple para la visualización
import Filtros from './Filtros';
// import CarouselCard from './CarouselCard'; // Usa este si quieres el carrusel
import style from './ProductList.module.css'; // Si usas módulos CSS

// La URL base de tu API
const API_BASE_URL = 'http://localhost:4000/api/v1'; 

export default function ProductList() {
  const [productos, setProductos] = useState([]);
  const [filtros, setFiltros] = useState({
    nombre: '',
    categoria: '', // Asumimos que es el ID de la categoría
    precioMin: 0,
    precioMax: 1000,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [categorias, setCategorias] = useState([]); // 📌 Estado para las categorías del filtro

  //Función para obtener la lista de productos basada en los filtros
  const fetchProductos = useCallback(async () => {
    setIsLoading(true);
    
    // 1. Construir la Query String (URLSearchParams)
    const params = new URLSearchParams();
    if (filtros.nombre) params.append('nombre', filtros.nombre);
    if (filtros.categoria) params.append('categoria_id', filtros.categoria);
    if (filtros.precioMin > 0) params.append('precioMin', filtros.precioMin);
    if (filtros.precioMax < 1000) params.append('precioMax', filtros.precioMax);
    
    const queryString = params.toString();
    const url = `${API_BASE_URL}/productos?${queryString}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Fallo al obtener productos`);
      }
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error fetching productos:", error);
      setProductos([]); // Limpiar la lista en caso de error
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
  }, [fetchProductos]); // Dependencia del useCallback

  if (isLoading) return <div className="text-center py-10">Cargando productos...</div>;


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
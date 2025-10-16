// src/app/catalogo/page.js

import React from 'react';
import ProductList from '@/components/productos/ProductList'; // Ajusta la ruta si es necesario

/* Función para obtener los productos del backend (Componente Servidor)
async function fetchProductos() {
    const API_URL = 'http://localhost:4000/api/v1'
    try {
    const res = await fetch(`${API_URL}/productos`, { 
        cache: 'no-store', // Deshabilitar la caché de Next.js
        headers: {
            // 📌 CRÍTICO: Asegurar que el servidor Express sabe que esperamos JSON
            'Accept': 'application/json',
        }
    });

    if (!res.ok) {
      // Si la API falla, registramos el error en la terminal de Next.js
      const errorText = await res.text();
      console.error('API Error (Estado no OK):', res.status, errorText);
      return []; 
    }

    // 📌 CRÍTICO: Obtener el JSON. Si la respuesta es vacía o mal formada, el .json() fallará
    const data = await res.json();
    
    // Verificación final antes de retornar (solo para depuración)
    console.log(`Productos cargados: ${data.length} items`); 
    
    // Si la data no es un array, devuélvelo vacío (esto protege contra errores de formato)
    if (!Array.isArray(data)) {
        console.error("La respuesta de la API no es un array:", data);
        return [];
    }

    return data;
    
    } catch (error) {
        // Esto atrapará errores de conexión (fetch failed) o de parsing JSON.
        console.error("Error FATAL al cargar productos:", error.message);
        return [];
    }
}*/


export default async function CatalogoPage() {
  //const productos = await fetchProductos();

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">Nuestro Catálogo</h1>
      
      {/* 📌 Usa el componente ProductList */}
      <ProductList />
      
    </div>
  );
}
// src/app/catalogo/page.js

import React from 'react';
import ProductList from '@/components/productos/ProductList'; // Ajusta la ruta si es necesario


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
// components/products/ProductDetail.js
'use client'; 

import Image from 'next/image';
import { useState, useEffect } from 'react';

// Se asume que este componente recibirá el ID del producto de la URL
export default function ProductDetail({ productoId }) {
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Lógica para cargar el producto específico
  useEffect(() => {
    const loadProduct = async () => {
      // Implementar la lógica para hacer fetch de UN solo producto (ej: GET /api/productos/:id)
      // setProducto(datosObtenidos);
      setIsLoading(false);
    };
    loadProduct();
  }, [productoId]);
  
  // Función para agregar al carrito (se usará el CartContext más adelante)
  const handleAddToCart = () => {
    console.log(`Agregando ${cantidad} de ${producto.nombre} al carrito.`);
    // Implementar lógica de CartContext.addToCart
  };

  if (isLoading) return <div>Cargando detalles del producto...</div>;
  if (!producto) return <div>Producto no encontrado.</div>;

  return (
    <div className="producto-detalle-grid">
      {/* 1. Carrusel/Galería de Imágenes */}
      <div className="galeria-imagenes">
        {/* Muestra varias imágenes del producto */}
      </div>

      {/* 2. Información Principal */}
      <div className="info-principal">
        <h1>{producto.nombre}</h1>
        <p className="precio">${producto.precio.toFixed(2)}</p>
        <p className="descripcion">{producto.descripcion}</p>
        
        {/* Tallas y Colores (variantes de producto) */}
        <div className="opciones-variantes">
            {/* Componente de selección de Talla y Color */}
        </div>
        
        {/* 3. Área de Compra */}
        <div className="area-compra">
          <input 
            type="number" 
            min="1" 
            value={cantidad} 
            onChange={(e) => setCantidad(Number(e.target.value))}
          />
          <button onClick={handleAddToCart}>Agregar al Carrito</button>
        </div>
        
        {/* 4. Reseñas y Calificaciones (Componente futuro) */}
        <div className="seccion-reviews">
          {/* Aquí irá el componente para mostrar y agregar reseñas */}
        </div>
      </div>
    </div>
  );
}
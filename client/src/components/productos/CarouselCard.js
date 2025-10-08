// components/products/CarouselCard.js
'use client'; 

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function CarouselCard({ producto }) {
  // Estado local para manejar qué imagen se muestra actualmente en el carrusel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Lógica para avanzar en el carrusel (solo estructura)
  const nextImage = () => {
    // Implementar la lógica para cambiar currentImageIndex al siguiente índice
    // Usando producto.imagenes.length
  };

  return (
    <div className="carousel-card-container">
      {/* 1. Carrusel de Imágenes (Visualización de la imagen actual) */}
      <div className="carrusel-visual">
        <Image
          // Mostrar la imagen actual basada en currentImageIndex
          src={producto.imagenes[currentImageIndex].url}
          alt={producto.nombre}
          width={400} 
          height={400} 
          style={{ objectFit: 'cover' }}
        />
        {/* Botones de navegación (anterior/siguiente) */}
        <button onClick={nextImage}>{' > '}</button>
      </div>
      
      <div className="info-producto">
        <Link href={`/productos/${producto.id}`}>
          <h3>{producto.nombre}</h3>
        </Link>
        <p className="precio">${producto.precio.toFixed(2)}</p>
      </div>
    </div>
  );
}
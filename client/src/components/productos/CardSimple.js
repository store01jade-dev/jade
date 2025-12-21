// components/products/CardSimple.js
'use client';

import Link from 'next/link';
import Image from 'next/image';
import placeHolder from '../../../public/assests/placeholder.jpg'
import style from './CardSimple.module.css'

export default function CardSimple({ producto }) {
  const BASE_URL_API = process.env.NEXT_PUBLIC_API_URL;
  const DEFAULT_IMAGE_URL = placeHolder; 
  
  // 1. Buscamos la imagen principal o la primera disponible
  const imagenPrincipal = producto.imagenesProducto?.find(img => img.principal === true) || producto.imagenesProducto?.[0];
  const urlBase = imagenPrincipal?.url;
  
  // 2. CAMBIO CLAVE: Lógica de detección de URL
  let finalSrc;
  if (!urlBase) {
    finalSrc = DEFAULT_IMAGE_URL;
  } else if (urlBase.startsWith('http')) {
    // Si ya es una URL de Cloudinary, la usamos tal cual
    finalSrc = urlBase;
  } else {
    // Si es una ruta vieja local, le pegamos la base de la API
    finalSrc = `${BASE_URL_API}${urlBase}`;
  }
    
  // El cacheBuster solo es realmente útil para imágenes locales que cambian de contenido 
  // pero mantienen el mismo nombre. Para Cloudinary no es necesario, pero no estorba.
  const cacheBuster = imagenPrincipal?.updatedAt ? new Date(imagenPrincipal.updatedAt).getTime() : Date.now();

  return (
    <Link href={`/productos/${producto.id}`} className={style.cardSimple}>
      <div className={style.imagenWrapper}>
        <Image 
          // Solo aplicamos el cache buster si NO es una URL externa para evitar URLs extrañas en Cloudinary
          src={urlBase?.startsWith('http') ? finalSrc : `${finalSrc}?v=${cacheBuster}`} 
          alt={`Imagen de ${producto.nombre}`} 
          width={300} 
          height={300} 
          style={{ objectFit: 'contain' }}
          // Prioridad para que las tarjetas carguen rápido
          priority={false} 
        />
      </div>
      
      <h3 className={style.nombreProducto}>
        {producto.nombre}
      </h3>
    </Link>
  );
}
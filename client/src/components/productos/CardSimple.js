// components/products/CardSimple.js
'use client'; // Necesario si usas Link de Next.js o quieres interactividad

import Link from 'next/link';
import Image from 'next/image';
import placeHolder from '../../../public/assests/placeholder.jpg'
import style from './CardSimple.module.css'

// Recibe las propiedades del producto
export default function CardSimple({ producto }) {
  // Definir la base del servidor de archivos
  // En producción, esto debería ser tu dominio de API, pero para desarrollo es 4000.
  const BASE_URL_API = process.env.NEXT_PUBLIC_API_URL;
  // Asegúrate de usar las propiedades que necesitas (id, nombre, imagenUrl)
  const DEFAULT_IMAGE_URL = placeHolder; 
  
  /* Buscar la imagen en el array 'imagenesProducto'
  // El producto.imagenesProducto es un ARRAY debido al hasMany.
  const imagenObjeto = producto.imagenesProducto ? producto.imagenesProducto[0] : null; 
  
  // Asignar la URL, usando el placeholder si no existe la imagenObjeto o su URL
  const imagenUrl = imagenObjeto?.url || DEFAULT_IMAGE_URL;*/ 

  // ... lógica para obtener imagenObjeto (ya corregida)
  //const imagenObjeto = producto.imagenesProducto ? producto.imagenesProducto[0] : null; 
  const imagenPrincipal = producto.imagenesProducto.find(img => img.principal === true) || producto.imagenesProducto[0]; // Si no hay principal, toma la primera.
  const imagenUrlRelativa = imagenPrincipal?.url;
  
  // Construye la URL absoluta
  const finalSrc = imagenUrlRelativa 
    ? `${BASE_URL_API}${imagenUrlRelativa}` // Ej: http://localhost:4000/uploads/...
    : DEFAULT_IMAGE_URL;
    
  const cacheBuster = Date.now();

  return (
    <Link href={`/productos/${producto.id}`} className={style.cardSimple}>
      {/* 1. Imagen del Producto */}
      <div className={style.imagenWrapper}>
        <Image src={`${finalSrc}?v=${cacheBuster}`} 
          alt={`Imagen de ${producto.nombre}`} 
          width={300} 
          height={300} 
          style={{ objectFit: 'contain' }}
        />
      </div>
      
      {/* 2. Nombre */}
      <h3 className={style.nombreProducto}>
        {producto.nombre}
      </h3>
      
    </Link>
  );
}
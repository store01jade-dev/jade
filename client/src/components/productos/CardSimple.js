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
  const BASE_URL_API = 'http://localhost:4000';
  // Asegúrate de usar las propiedades que necesitas (id, nombre, imagenUrl)
  const DEFAULT_IMAGE_URL = placeHolder; 
  
  /* Buscar la imagen en el array 'imagenesProducto'
  // El producto.imagenesProducto es un ARRAY debido al hasMany.
  const imagenObjeto = producto.imagenesProducto ? producto.imagenesProducto[0] : null; 
  
  // Asignar la URL, usando el placeholder si no existe la imagenObjeto o su URL
  const imagenUrl = imagenObjeto?.url || DEFAULT_IMAGE_URL;*/ 

  // ... lógica para obtener imagenObjeto (ya corregida)
  const imagenObjeto = producto.imagenesProducto ? producto.imagenesProducto[0] : null; 
  const imagenUrlRelativa = imagenObjeto?.url;
  
  // Construye la URL absoluta
  const finalSrc = imagenUrlRelativa 
    ? `${BASE_URL_API}${imagenUrlRelativa}` // Ej: http://localhost:4000/uploads/...
    : DEFAULT_IMAGE_URL;


  return (
    <Link href={`/productos/${producto.id}`} className={style.cardSimple}>
      {/* 1. Imagen del Producto */}
      <div className={style.imagenWrapper}>
        <Image src={finalSrc} 
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
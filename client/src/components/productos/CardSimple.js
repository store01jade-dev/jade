// components/products/CardSimple.js
'use client'; // Necesario si usas Link de Next.js o quieres interactividad

import Link from 'next/link';
import Image from 'next/image';
import style from './CardSimple.module.css'

// Recibe las propiedades del producto
export default function CardSimple({ producto }) {
  // Asegúrate de usar las propiedades que necesitas (id, nombre, imagenUrl)

  return (
    <Link href={`/productos/${producto.id}`} className={style.cardSimple}>
      {/* 1. Imagen del Producto */}
      <div className={style.imagenWrapper}>
        <Image 
          src={producto.imagenUrl} 
          alt={producto.nombre} 
          width={300} 
          height={300} 
          style={{ objectFit: 'cover' }}
        />
      </div>
      
      {/* 2. Nombre */}
      <h3 className={style.nombreProducto}>{producto.nombre}</h3>
    </Link>
  );
}
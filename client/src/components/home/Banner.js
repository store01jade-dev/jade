// components/home/Banner.js
import React from 'react';
import Link from 'next/link';
import style from './Banner.module.css'; // Usamos los estilos definidos

export default function Banner() {
  return (
    <section className={style.banner}>
      <div className={style.bannerContent}>
        <h1>Descubre la Última Colección</h1>
        <p>Estilo, comodidad y calidad en un solo lugar.</p>
        <Link href="/catalogo" passHref>
          <button className={style.bannerButton}>Comprar Ahora</button>
        </Link>
      </div>
    </section>
  );
}
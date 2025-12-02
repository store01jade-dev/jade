// src/app/confirmacion-pedido/page.js
'use client';
import React from 'react';
import Link from 'next/link';
import styles from './Confirmation.module.css'; // Crearás este CSS

export default function ConfirmationPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>🎉</div>
        <h1 className={styles.title}>¡Pedido Realizado con Éxito!</h1>
        <p className={styles.message}>
          Gracias por tu compra. Hemos recibido tu pedido y estamos procesándolo.
        </p>
        <p className={styles.details}>
          Recibirás un correo electrónico de confirmación con los detalles del pedido en breve.
        </p>
        <Link href="/mis-pedidos" className={styles.buttonPrimary}>
          Ver mis Pedidos
        </Link>
        <Link href="/" className={styles.buttonSecondary}>
          Volver a la Tienda
        </Link>
      </div>
    </div>
  );
}
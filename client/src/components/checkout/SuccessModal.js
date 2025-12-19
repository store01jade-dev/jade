// src/components/checkout/SuccessModal.js
import React from 'react';
import Link from 'next/link';
import styles from './SuccessModal.module.css';

export default function SuccessModal({ orderId, onClose, deliveryData }) {
    return (
        <div className={styles.overlay}>
            <div className={`${styles.modal} printable-area`}>
                <div className={styles.noPrint}>
                    <div className={styles.icon}>✓</div>
                    <h2>¡Pedido Confirmado!</h2>
                </div>
                
                <div className={styles.orderInfo}>
                    <p>Orden: <strong>#{orderId?.toString().padStart(5, '0')}</strong></p>
                    <hr />
                    <div className={styles.details}>
                        <p><strong>Entregar a:</strong> {deliveryData?.nombreCompleto}</p>
                        <p><strong>Ciudad:</strong> {deliveryData?.ciudad}</p>
                        <p><strong>Barrio:</strong> {deliveryData?.barrio}</p>
                        <p><strong>Dirección:</strong> {deliveryData?.direccion}</p>
                        {deliveryData?.notas && (
                            <p className={styles.notes}><strong>Notas:</strong> {deliveryData.notas}</p>
                        )}
                    </div>
                </div>

                <div className={`${styles.buttons} ${styles.noPrint}`}>
                    <button onClick={() => window.print()} className={styles.btnPrint}>
                        🖨️ Imprimir Comprobante
                    </button>
                    <button onClick={onClose} className={styles.btnHome}>
                        Finalizar y volver al inicio
                    </button>
                    <Link href="/perfil/pedidos" className={styles.btnOrders}>
                        Ver mis pedidos
                    </Link>
                </div>
            </div>
        </div>
    );
}
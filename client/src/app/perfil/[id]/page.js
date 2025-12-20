'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './DetallePedido.module.css';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function DetallePedidoPage() {
    const { id } = useParams();
    const { token } = useAuth();
    const router = useRouter();
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetalle = async () => {
            try {
                const response = await fetch(`${API_URL}/api/v1/orders/mis-pedidos/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();

                console.log("DATOS DEL PEDIDO:", data);
                
                if (response.ok) {
                    setPedido(data);
                } else {
                    console.error("Pedido no encontrado");
                }
            } catch (error) {
                console.error("Error cargando detalle:", error);
            } finally {
                setLoading(false);
            }
        };

        if (token && id) fetchDetalle();
    }, [token, id]);

    if (loading) return <div className={styles.loading}>Cargando detalles del pedido...</div>;
    if (!pedido) return <div className={styles.error}>No se encontró el pedido.</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/mis-pedidos" className={styles.backBtn}>← Volver a mis pedidos</Link>
                <h1>Pedido #{pedido.id.toString().padStart(5, '0')}</h1>
                <span className={`${styles.status} ${styles[pedido.status.toLowerCase()]}`}>
                    {pedido.status}
                </span>
            </div>

            <div className={styles.grid}>
                {/* Columna Izquierda: Productos */}
                <div className={styles.productsSection}>
                    <h3>Productos</h3>
                    <div className={styles.itemsList}>
                        {pedido.detalles?.map((item) => (
                            <div key={item.id} className={styles.productItem}>
                                <div className={styles.productInfo}>
                                    {/* Ajusta según cómo devuelva tu API el nombre del producto */}
                                    <p className={styles.productName}>
                                        {item.variante?.producto?.nombre || "Producto"} 
                                    </p>
                                    <p className={styles.productMeta}>
                                        Talla: {item.variante?.talla} | Color: {item.variante?.color}
                                    </p>
                                </div>
                                <div className={styles.productPrice}>
                                    <span>{item.cantidad} x ${Number(item.precio_unitario).toLocaleString()}</span>
                                    <p><strong>${Number(item.subtotal).toLocaleString()}</strong></p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.totalBox}>
                        <div className={styles.totalRow}>
                            <span>Subtotal</span>
                            <span>${Number(pedido.total).toLocaleString()}</span>
                        </div>
                        <div className={`${styles.totalRow} ${styles.mainTotal}`}>
                            <span>Total Pagado</span>
                            <span>${Number(pedido.total).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Datos de Envío */}
                <div className={styles.shippingSection}>
                    <div className={styles.infoCard}>
                        <h3>Datos de Entrega</h3>
                        <p><strong>Recibe:</strong> {pedido.direccion?.nombre_quien_recibe}</p>
                        <p><strong>Documento:</strong> {pedido.direccion?.documento_identidad}</p>
                        <p><strong>Teléfono:</strong> {pedido.direccion?.telefono}</p>
                        <p><strong>Ciudad:</strong> {pedido.direccion?.ciudad}</p>
                        <p><strong>Barrio:</strong> {pedido.direccion?.barrio}</p>
                        <p><strong>Dirección:</strong> {pedido.direccion?.direccion}</p>
                        {pedido.direccion?.referencias && (
                            <div className={styles.notes}>
                                <strong>Notas:</strong>
                                <p>{pedido.direccion.referencias}</p>
                            </div>
                        )}
                    </div>

                    <div className={styles.infoCard}>
                        <h3>Método de Pago</h3>
                        <p>{pedido.metodo_pago === 'contra_entrega' ? 'Efectivo (Contra entrega)' : 'Pago en línea'}</p>
                        <p className={styles.date}>Realizado el: {new Date(pedido.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
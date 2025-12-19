/*'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext'; // Tu contexto de auth

export default function MisPedidos() {
    const [pedidos, setPedidos] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        const fetchPedidos = async () => {
            const res = await fetch('http://localhost:4000/api/v1/orders/my-orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setPedidos(data);
        };
        if (token) fetchPedidos();
    }, [token]);

    return (
        <div className="container">
            <h1>Mis Compras</h1>
            <div className="orders-grid">
                {pedidos.map(pedido => (
                    <div key={pedido.id} className="order-card">
                        <div className="order-header">
                            <span>Pedido #{pedido.id}</span>
                            <span className={`status ${pedido.status}`}>
                                {pedido.status.toUpperCase()}
                            </span>
                        </div>
                        <p>Total: ${pedido.total.toLocaleString()}</p>
                        <p>Fecha: {new Date(pedido.createdAt).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}*/


'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './MisPedidos.module.css';
import Link from 'next/link';

export default function MisPedidosPage() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/v1/orders/mis-pedidos', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setPedidos(data);
            } catch (error) {
                console.error("Error cargando pedidos:", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchPedidos();
    }, [token]);

    if (loading) return <div className={styles.loader}>Cargando tus pedidos...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Mis Pedidos</h1>
            
            {pedidos.length === 0 ? (
                <div className={styles.empty}>
                    <p>Aún no has realizado ninguna compra.</p>
                    <Link href="/" className={styles.btnShop}>Ir a la tienda</Link>
                </div>
            ) : (
                <div className={styles.list}>
                    {pedidos.map((pedido) => (
                        <div key={pedido.id} className={styles.orderCard}>
                            <div className={styles.orderHeader}>
                                <div>
                                    <span className={styles.orderId}>Pedido #{pedido.id}</span>
                                    <p className={styles.date}>{new Date(pedido.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className={`${styles.status} ${styles[pedido.status.toLowerCase()]}`}>
                                    {pedido.status}
                                </span>
                            </div>

                            <div className={styles.orderBody}>
                                <p><strong>Total:</strong> ${pedido.total.toLocaleString()}</p>
                                <p><strong>Envío a:</strong> {pedido.Direccion?.direccion}, {pedido.Direccion?.ciudad}</p>
                            </div>
                            
                            <Link href={`/perfil/${pedido.id}`} className={styles.btnDetail}>
                                Ver detalles
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
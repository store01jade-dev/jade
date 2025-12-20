'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './AdminOrders.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminOrdersPage() {
    const [pedidos, setPedidos] = useState([]);
    const { token } = useAuth();
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchAllOrders = async () => {
        const res = await fetch(`${API_URL}/api/v1/orders/admin/all`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        // Si la respuesta no es OK, no intentamos parsear JSON
        if (!res.ok) {
            const errorText = await res.text();
            console.error("Error del servidor:", errorText);
            return;
        }

        const data = await res.json();
        setPedidos(data);
    };

    useEffect(() => {
        if (token) fetchAllOrders();
    }, [token]);

    const handleStatusChange = async (id, newStatus) => {
        const res = await fetch(`${API_URL}/api/v1/orders/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        if (res.ok) fetchAllOrders(); // Recargamos la lista
    };

    return (
        <div className={styles.adminContainer}>
            <h1>Panel de Administración: Pedidos</h1>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map(p => (
                        <tr key={p.id}>
                            <td>#{p.id}</td>
                            <td>{p.usuario?.nombre}</td>
                            <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                            <td>${p.total.toLocaleString()}</td>
                            
                            <td>
                                <select 
                                    value={p.status} 
                                    className={`${styles.statusSelect} ${styles[p.status.toLowerCase()]}`}
                                    onChange={(e) => handleStatusChange(p.id, e.target.value)}
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Enviado">Enviado</option>
                                    <option value="Entregado">Entregado</option>
                                </select>
                            </td>

                            <td>
                                <button 
                                    className={styles.btnDetail} 
                                    onClick={() => setSelectedOrder(p)}
                                >
                                    📋 Ver Guía
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* MODAL DE INFORMACIÓN DE ENVÍO */}
            {selectedOrder && (
                <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.btnClose} onClick={() => setSelectedOrder(null)}>&times;</button>
                        
                        <h2>Datos para el Envío #{selectedOrder.id}</h2>
                        <hr />
                        
                        <div className={styles.infoSection}>
                            <p><strong>Destinatario:</strong> {selectedOrder.direccion?.nombre_completo || selectedOrder.usuario?.nombre}</p>
                            <p><strong>Teléfono:</strong> {selectedOrder.direccion?.telefono}</p>
                            <p><strong>Cédula/NIT:</strong> {selectedOrder.direccion?.documento_identidad || 'No proporcionado'}</p>
                            <p><strong>Ciudad:</strong> {selectedOrder.direccion?.ciudad} - {selectedOrder.direccion?.departamento}</p>
                            <p><strong>Barrio:</strong> {selectedOrder.direccion?.barrio}</p>
                            <p><strong>Dirección:</strong> {selectedOrder.direccion?.direccion}</p>
                            
                            <div className={styles.notesBox}>
                                <strong>Notas de entrega:</strong>
                                <p>{selectedOrder.direccion?.referencias || 'Sin notas adicionales'}</p>
                            </div>
                        </div>

                        <div className={styles.modalActions}>
                            <button 
                                className={styles.btnPrint} 
                                onClick={() => window.print()}
                            >
                                🖨️ Imprimir Guía
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
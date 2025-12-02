// src/components/checkout/CartSummary.js
import React from 'react';
import styles from './CartSummary.module.css';

// Función auxiliar para formatear a moneda
const formatCurrency = (amount) => {
    // Asumiendo moneda colombiana o similar (ajusta según tu necesidad)
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP', // O USD, EUR, etc.
        minimumFractionDigits: 0 
    }).format(amount);
};

export default function CartSummary({ items, total, isProcessing }) {
    // Calcular subtotales (puedes ajustar esta lógica según tu CartContext)
    const subtotal = total; // Si 'total' ya viene sin envío/impuestos
    const shippingCost = 15000; // Costo fijo simulado
    const taxRate = 0.19; // 19% IVA simulado
    
    // Cálculo de impuestos y total final
    const taxes = subtotal * taxRate;
    const finalTotal = subtotal + shippingCost + taxes;

    if (!items || items.length === 0) {
        return <div className={styles.empty}>El carrito está vacío.</div>;
    }

    return (
        <div className={styles.summaryCard}>
            
            {/* Listado de Productos */}
            <div className={styles.productList}>
                {items.map((item) => (
                    <div key={item.id} className={styles.productItem}>
                        <div className={styles.itemDetails}>
                            <span className={styles.itemName}>{item.name}</span>
                            <span className={styles.itemQuantity}>x {item.quantity}</span>
                        </div>
                        <span className={styles.itemPrice}>
                            {formatCurrency(item.price * item.quantity)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Separador */}
            <hr className={styles.divider} />

            {/* Desglose de Costos */}
            <div className={styles.costBreakdown}>
                <div className={styles.costRow}>
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                
                <div className={styles.costRow}>
                    <span>Costo de Envío</span>
                    <span>{formatCurrency(shippingCost)}</span>
                </div>
                
                <div className={styles.costRow}>
                    <span>Impuestos (19%)</span>
                    <span>{formatCurrency(taxes)}</span>
                </div>
            </div>

            {/* Separador */}
            <hr className={styles.divider} />

            {/* Total Final */}
            <div className={`${styles.costRow} ${styles.totalRow}`}>
                <strong>Total a Pagar</strong>
                <strong>{formatCurrency(finalTotal)}</strong>
            </div>
            
            {isProcessing && <p className={styles.processingText}>Calculando...</p>}
        </div>
    );
}
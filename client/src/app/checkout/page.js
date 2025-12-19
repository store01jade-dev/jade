'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutForm from '../../components/checkout/CheckoutForm';
import CartSummary from '../../components/checkout/CartSummary'; 
import SuccessModal from '../../components/checkout/SuccessModal'; // Importamos el modal
import styles from './Checkout.module.css';
import { useCart } from '../../components/context/CartContext'; 
import { useAuth } from '../../context/AuthContext'; 

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { isAuthenticated, user, token, isLoading } = useAuth();
    const router = useRouter();
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [deliveryData, setDeliveryData] = useState(null);

    // 1. Validaciones de Acceso y Redirección al carrito
    useEffect(() => {
        // Solo redirigimos si NO estamos cargando, NO está autenticado,
        // el carrito está vacío Y NO acabamos de terminar un pedido.
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/login?redirect=/checkout');
            } else if (cartItems.length === 0 && !showSuccessModal) {
                router.push('/carrito');
            }
        }
    }, [isLoading, isAuthenticated, cartItems.length, showSuccessModal, router]);

    const handleShippingSubmit = async (formData) => {
        if (isProcessing) return;
        setIsProcessing(true);
        setDeliveryData(formData); // Guardamos para el modal

        const orderData = {
            usuario_id: user.id,
            total: cartTotal,
            metodoPago: formData.metodoPago,
            items: cartItems.map(item => ({
                producto_id: item.id,
                cantidad: item.quantity,
                precio_unitario: item.price
            })),
            envio: formData
        };

        try {
            const response = await fetch('http://localhost:4000/api/v1/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData),
                metodo_pago: formData.metodoPago === 'contra_entrega' ? 'Contra entrega' : 'Pago en línea',
            });

            const data = await response.json(); 

            if (response.ok) {
                setOrderId(data.pedidoId || data.id);
                // 🚩 PASO CRÍTICO: Primero activamos el modal, luego limpiamos el carrito
                setShowSuccessModal(true); 
                clearCart(); 
            } else {
                alert(data.message || data.error || 'Error al crear el pedido');
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('No se pudo conectar con el servidor.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Renderizado de carga
    if (isLoading) return <div className={styles.loading}>Cargando...</div>;

    // Prevenimos renderizar el formulario si el carrito está vacío (y no hay modal)
    if (cartItems.length === 0 && !showSuccessModal) return null;

    return (
        <div className={styles.checkoutContainer}>
            <h1 className={styles.title}>Finalizar Compra</h1>
            
            <div className={styles.contentGrid}>
                <div className={styles.formColumn}>
                    <CheckoutForm 
                        onSubmit={handleShippingSubmit} 
                        isProcessing={isProcessing}
                        userData={user} 
                    />
                </div>

                <div className={styles.summaryColumn}>
                    <CartSummary 
                        items={cartItems} 
                        total={cartTotal}
                        isProcessing={isProcessing}
                    />
                </div>
            </div>

            {/* MODAL DE ÉXITO */}
            {showSuccessModal && (
                <SuccessModal 
                    orderId={orderId} 
                    deliveryData={deliveryData}
                    onClose={() => window.location.href = '/'} 
                />
            )}

            {isProcessing && (
                <div className={styles.processingOverlay}>
                    <div className={styles.spinner}></div>
                    <p>Estamos procesando tu pedido...</p>
                </div>
            )}
        </div>
    );
}
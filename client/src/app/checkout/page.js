// src/app/checkout/page.js
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutForm from '../../components/checkout/CheckoutForm'; // Lo crearemos en breve
import CartSummary from '../../components/checkout/CartSummary';   // Lo crearemos en breve
import styles from './Checkout.module.css';
// Supongamos que usas tu CartContext
import { useCart } from '../../components/context/CartContext'; 
// Supongamos que usas tu AuthContext
import { useAuth } from '../../context/AuthContext'; 

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { isAuthenticated, user, isLoading } = useAuth();
    const router = useRouter();
    
    // Estado para guardar los datos de envío y pago
    const [shippingData, setShippingData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Si el usuario no está autenticado o el carrito está vacío, redirigir
    if (isLoading) {
        return <div className={styles.loading}>Cargando...</div>;
    }
    
    if (!isAuthenticated) {
        router.push('/login?redirect=/checkout');
        return null;
    }
    
    if (cartItems.length === 0) {
        router.push('/carrito');
        return null;
    }

    // Esta función se llamará cuando el CheckoutForm se envíe con éxito
    const handleShippingSubmit = (data) => {
        setShippingData(data);
        // Aquí podrías pasar a una etapa de pago (si tuvieras Stripe/PayPal)
        // Por ahora, vamos a simular la creación de un pedido
        createOrder(data);
    };

    const createOrder = async (shippingInfo) => {
        setIsProcessing(true);
        // 📌 Aquí va la llamada al backend para crear la orden
        const orderData = {
            userId: user.id, // ID del usuario autenticado
            items: cartItems.map(item => ({
                productoId: item.id,
                cantidad: item.quantity,
                precioUnitario: item.price,
                // Puedes añadir más detalles como talla/color si es necesario
            })),
            direccionEnvio: shippingInfo,
            total: cartTotal,
            // método de pago simulado: 'Contrareembolso'
            metodoPago: 'Transferencia Bancaria (Simulado)' 
        };

        try {
            const response = await fetch('http://localhost:4000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Incluir el token JWT para autenticar al usuario en el backend
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, 
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                // Limpiar el carrito después del pedido exitoso (asume que esta función existe)
                clearCart(); 
                router.push('/confirmacion-pedido');
            } else {
                alert('Error al crear el pedido. Por favor, revisa tus datos.');
            }
        } catch (error) {
            console.error('Error de red al crear el pedido:', error);
            alert('Error de conexión con el servidor.');
        } finally {
            setIsProcessing(false);
        }
    };
    

    return (
        <div className={styles.checkoutContainer}>
            <h1 className={styles.title}>Finalizar Compra</h1>
            
            <div className={styles.contentGrid}>
                {/* Columna Izquierda: Formulario de Envío/Pago */}
                <div className={styles.formColumn}>
                    <h2>1. Dirección de Envío</h2>
                    <CheckoutForm 
                        onSubmit={handleShippingSubmit} 
                        isProcessing={isProcessing}
                        // Opcional: pasar datos del usuario para autocompletar
                        userData={user} 
                    />
                </div>

                {/* Columna Derecha: Resumen del Pedido */}
                <div className={styles.summaryColumn}>
                    <h2>2. Resumen del Pedido</h2>
                    <CartSummary 
                        items={cartItems} 
                        total={cartTotal}
                        isProcessing={isProcessing}
                    />
                </div>
            </div>

            {isProcessing && <div className={styles.processingOverlay}>Procesando pedido...</div>}
        </div>
    );
}
// components/cart/CartPage.js
'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/context/CartContext';
import { useRouter } from 'next/navigation';
import styles from './CartPage.module.css';
import { useAuth } from '@/context/AuthContext';


// -----------------------------------------------------------
// Componente de una sola fila de producto
// -----------------------------------------------------------
const CartItem = ({ item }) => {
    const { updateItemQuantity, removeItemFromCart } = useCart();
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    
    // Función para manejar el cambio de cantidad
    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value);
        updateItemQuantity(item.id, newQuantity);
    };

    // LÓGICA DE URL INTELIGENTE
    // Verificamos si item.image ya es una URL completa o si necesita el prefijo
    const finalImageUrl = item.image?.startsWith('http') 
        ? item.image 
        : `${API_BASE_URL}${item.image}`;

    return (
        <div className={styles.cartItem}>
            <div className={styles.itemImage}>
                <Image src={finalImageUrl} alt={item.name} width={80} height={80} style={{ objectFit: 'contain' }} />
            </div>

            <div className={styles.itemDetails}>
                <Link href={`/productos/${item.id}`} className={styles.itemName}>{item.name}</Link>
                <p className={styles.itemPrice}>Precio: ${item.price.toFixed(2)}</p>
                <button onClick={() => removeItemFromCart(item.id)} className={styles.removeButton}>
                    Eliminar
                </button>
            </div>

            <div className={styles.itemQuantity}>
                <input
                    type="number"
                    value={item.quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    className={styles.quantityInput}
                />
            </div>
            
            {/* ... subtotal ... */}
            <div className={styles.itemSubtotal}>
                ${((item.price || 0) * item.quantity).toFixed(2)}
            </div>
        </div>
    );
};

// -----------------------------------------------------------
// Componente Principal de la Página del Carrito
// -----------------------------------------------------------
export default function CartPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    //Funcion que maneja la navegacion
    const handleCheckout = () => {
        if(isAuthenticated) {
            //Si el usuario esta logueado, ve al checkout
            router.push('/checkout');
        } else {
            //Si no esta logueado ve a login 
            // La página de login debe redirigir al checkout después del inicio de sesión.
            router.push('/login?redirect=/checkout');
        }
    }

    if (cartItems.length === 0) {
        return (
            <div className={styles.emptyCart}>
                <h2>Tu carrito está vacío 😔</h2>
                <p>Parece que aún no has añadido productos.</p>
                <Link href="/" className={styles.backToShopButton}>Volver a la Tienda</Link>
            </div>
        );
    }

    return (
        <div className={styles.cartContainer}>
            <div className={styles.itemList}>
                {cartItems.map(item => (
                    <CartItem key={item.id} item={item} />
                ))}
            </div>

            <div className={styles.cartSummary}>
                <h2>Resumen de la Orden</h2>
                <div className={styles.summaryRow}>
                    <span>Subtotal:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                    <span>Envío:</span>
                    <span>Calcular en el Checkout</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                    <span>Total Estimado:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                </div>
                
                <button className={styles.checkoutButton} onClick={handleCheckout}>
                    Proceder al Pago (Checkout)
                </button>
                <button onClick={clearCart} className={styles.clearCartButton}>
                    Vaciar Carrito
                </button>
            </div>
        </div>
    );
}
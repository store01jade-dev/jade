// app/carrito/page.js

import React from 'react';
// Asegúrate que la ruta al componente CartPage sea correcta
import CartPage from '@/components/cart/CartPage'; 

export default function CarritoPage() {
    // Este componente actúa como un contenedor de servidor
    return (
        <div style={{ padding: '2rem' }}>
            <h1>Tu Carrito de Compras</h1>
            {/* CartPage es el componente cliente que usa useCart() */}
            <CartPage /> 
        </div>
    );
}
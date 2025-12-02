// context/CartContext.js
'use client';

import React, { createContext, useContext, useState } from 'react';

// 1. Crear el Contexto
const CartContext = createContext();

// 2. Crear el Hook para fácil acceso
export const useCart = () => {
    return useContext(CartContext);
};

// 3. Crear el Proveedor (Provider)
export function CartProvider({ children }) {
    // Estado principal del carrito: un array de objetos
    // Cada objeto tendrá: { id, name, price, quantity, image }
    const [cartItems, setCartItems] = useState([]);

    // --- Lógica CRUD del Carrito ---

    // 📌 Ahora 'product' es en realidad el objeto VarianteProducto
    const addItemToCart = (productVariant, quantity = 1, imageUrl) => {
        // Usamos productVariant.id, que es el ID de la variante
        const existingItem = cartItems.find(item => item.id === productVariant.id); 

        if (existingItem) {
            // ... (lógica de aumento de cantidad) ...
        } else {
            // Si es nuevo, añadirlo al carrito
            setCartItems([
                ...cartItems,
                {
                    id: productVariant.id,
                    // Usamos una combinación de nombre, talla y color para el display
                    name: `${productVariant.nombre} (${productVariant.talla}, ${productVariant.color})`, 
                    price: parseFloat(productVariant.precio), // 👈 USAMOS LA PROPIEDAD 'precio' de la variante
                    image: imageUrl || '/assests/placeholder.jpg',
                    quantity: quantity,
                },
            ]);
        }
    };

    // Remover completamente un ítem
    const removeItemFromCart = (productId) => {
        setCartItems(cartItems.filter(item => item.id !== productId));
    };

    // Aumentar/disminuir cantidad de un ítem
    const updateItemQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeItemFromCart(productId);
            return;
        }

        setCartItems(
            cartItems.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };
    
    // Calcular el total de artículos y el monto total
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Limpiar el carrito (usado después del checkout)
    const clearCart = () => {
        setCartItems([]);
    };

    const contextValue = {
        cartItems,
        totalItems,
        cartTotal,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        clearCart,
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
}
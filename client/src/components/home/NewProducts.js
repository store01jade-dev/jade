// components/home/NewProducts.js
'use client'; 
import React, { useState, useEffect } from 'react';
import CardSimple from '../productos/CardSimple'; // Tu componente de tarjeta
import style from './NewProducts.module.css'; 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; 

export default function NewProducts() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNewProducts = async () => {
            try {
                // Usamos el endpoint que creamos en el backend
                const response = await fetch(`${API_BASE_URL}/api/v1/productos/new`); 
                if (!response.ok) {
                    throw new Error('No se pudieron cargar las novedades');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching new products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNewProducts();
    }, []);

    if (isLoading) return <div className={style.loadingMessage}>Cargando novedades...</div>;

    console.log("Productos a Renderizar:", products.length);

    return (
        
        <section className={style.new}>
            <h2 className={style.sectionTitle}>Novedades</h2>
            
            <div className={style.productsGrid}>
                {products.map(product => (
                    <CardSimple key={product.id} producto={product} />
                ))}
            </div>
        </section>
        
    );
}
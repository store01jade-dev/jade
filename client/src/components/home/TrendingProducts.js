// components/home/TrendingProducts.js
'use client'; 
// (Similar a NewProducts.js y FeaturedCatalog.js, pero con el endpoint /productos/trending)

import React, { useState, useEffect } from 'react';
import CardSimple from '../productos/CardSimple.js'; 
import style from './TrendingProducts.module.css'; // Su propio CSS Module

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'; 

export default function TrendingProducts() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCatalogProducts = async () => {
            try {
                // Usamos el nuevo endpoint
                const response = await fetch(`${API_BASE_URL}/api/v1/productos/trending`); 
                if (!response.ok) {
                    throw new Error('No se pudieron cargar los productos del catálogo');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching catalog products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCatalogProducts();
    }, []);

    if (isLoading) return <div className={style.trendingSection}>Cargando productos en tendencia...</div>;

    //Si no hay productos (rating 0), no renderizar el contenido
    if (products.length === 0) {
        return (
            <section className={style.trendingSection}>
                <h2 className={style.sectionTitle}>Productos en Tendencia</h2>
                <p className={style.noDataMessage}>
                    Aún no hay suficientes votos para generar tendencias. ¡Sé el primero en votar!
                </p>
            </section>
        );
    }

    // Si hay productos, renderiza el grid:
    return (
        <section className={style.trendingSection}>
            <h2 className={style.sectionTitle}>Productos en Tendencia</h2>
            
            <div className={style.productsGrid}>
                {/* ... mapping de CardSimple ... */}
                {products.map(product => (
                    <CardSimple key={product.id} producto={product} />
                ))}
            </div>
        </section>
    );
}
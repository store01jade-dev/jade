// components/home/FeaturedCatalog.js
'use client'; 
import React, { useState, useEffect } from 'react';
import CardSimple from '../productos/CardSimple.js'; 
import style from './FeaturedCatalog.module.css'; // Su propio CSS Module

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; 

export default function FeaturedCatalog() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCatalogProducts = async () => {
            try {
                // Usamos el nuevo endpoint
                const response = await fetch(`${API_BASE_URL}/api/v1/productos/catalog-featured`); 
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

    if (isLoading) return <div className={style.loadingMessage}>Cargando catálogo destacado...</div>;

    return (
        <section className={style.catalogSection}>
            <h2 className={style.sectionTitle}>Catálogo Destacado</h2>
            
            <div className={style.productsGrid}>
                {products.map(product => (
                    <CardSimple key={product.id} producto={product} />
                ))}
            </div>
        </section>
    );
}
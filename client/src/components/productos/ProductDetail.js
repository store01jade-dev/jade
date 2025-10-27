/* components/products/ProductDetail.js
'use client'; 

import Image from 'next/image';
import { useState, useEffect } from 'react';
import style from './ProductoDetail.module.css';

// La URL base de tu API (la misma que usaste en ProductList)
const API_BASE_URL = 'http://localhost:4000/api/v1'; 

// Se asume que este componente recibirá el ID del producto de la URL
export default function ProductDetail({ productoId }) {
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

   // Lógica para cargar el producto específico
  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      
      // 📌 CRÍTICO: Usar el productoId para llamar al endpoint GET /productos/:id
      const url = `${API_BASE_URL}/productos/${productoId}`; 

      try {
          const response = await fetch(url);
          if (!response.ok) {
              // Si el ID es inválido, arroja un error para mostrar "Producto no encontrado"
              throw new Error("Producto no encontrado o error en el servidor.");
          }
          const data = await response.json();
          setProducto(data);
      } catch (error) {
          console.error("Error fetching product detail:", error);
          setProducto(null); // Asegura que el estado sea null si hay error
      } finally {
          setIsLoading(false);
      }
    };
    
    // Solo carga si tenemos un ID
    if (productoId) {
        loadProduct();
    }
    
  }, [productoId]); // La dependencia es correcta
  
  // Función para agregar al carrito (se usará el CartContext más adelante)
  const handleAddToCart = () => {
    console.log(`Agregando ${cantidad} de ${producto.nombre} al carrito.`);
    // Implementar lógica de CartContext.addToCart
  };

  if (isLoading) return <div>Cargando detalles del producto...</div>;
  if (error) return <div>{error}</div>; 
  if (!producto) return <div>Producto no encontrado.</div>;

  const precioPrincipal = producto.variantes?.[0]?.precio;

  return (
    <div className={style.productoDetalleGrid}>
      {/* 1. Carrusel/Galería de Imágenes ///
      <div className={style.galeriaImagenes}>
        {/* Muestra varias imágenes del producto ///
      </div>

      {/* 2. Información Principal ///
      <div className={style.infoPrincipal}>
        <h1>{producto.nombre}</h1>
        <p className={style.precio}>${parseFloat(precioPrincipal)?.toFixed(2)}</p>
        <p className={style.descripcion}>{producto.descripcion}</p>
        
        {/* Tallas y Colores (variantes de producto) ///
        <div className={style.opcionesVariantes}>
            {/* Componente de selección de Talla y Color ///
        </div>
        
        {/* 3. Área de Compra ///
        <div className={style.areaCompra}>
          <input 
            type="number" 
            min="1" 
            value={cantidad} 
            onChange={(e) => setCantidad(Number(e.target.value))}
          />
          <button onClick={handleAddToCart}>Agregar al Carrito</button>
        </div>
        
        {/* 4. Reseñas y Calificaciones (Componente futuro) ///
        <div className={style.seccionReviews}>
          {/* Aquí irá el componente para mostrar y agregar reseñas ///
        </div>
      </div>
    </div>
  );
}*/

// components/products/ProductDetail.js

'use client'; 
import Image from 'next/image';
import { useState, useEffect } from 'react';
// Asume que tienes este archivo:
import styles from './ProductoDetail.module.css'; 

// URL base para las imágenes externas
const BASE_URL_API = 'http://localhost:4000/api/v1'; 
const DEFAULT_IMAGE_URL = '/assests/Placeholder.svg'; // Asegúrate de tener un placeholder
const API_BASE_URL = 'http://localhost:4000'


export default function ProductDetail({ productoId }) {
  // ... (Estados y useEffect) ...
  // ... (Tu lógica para obtener precioPrincipal sigue siendo CRÍTICA) ...
  const [producto, setProducto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usamos el rating actual del producto como estado inicial (o 0 si no existe)
  const [currentRating, setCurrentRating] = useState(producto?.rating || 0);
  const [hasVoted, setHasVoted] = useState(false); // Para limitar el voto en el cliente

  // Lógica para cargar el producto específico
  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      
      // Usar el productoId para llamar al endpoint GET /productos/:id
      const url = `${BASE_URL_API}/productos/${productoId}`; 

      try {
          const response = await fetch(url);
          if (!response.ok) {
              // Si el ID es inválido, arroja un error para mostrar "Producto no encontrado"
              throw new Error("Producto no encontrado o error en el servidor.");
          }
          const data = await response.json();
          setProducto(data);
      } catch (error) {
          console.error("Error fetching product detail:", error);
          setProducto(null); // Asegura que el estado sea null si hay error
      } finally {
          setIsLoading(false);
      }
    };
    
    // Solo carga si tenemos un ID
    if (productoId) {
        loadProduct();
    }
    
  }, [productoId]); // La dependencia es correcta

    const precioPrincipal = producto?.variantes?.[0]?.precio;
    const imagenObjeto = producto?.imagenesProducto?.[0]; 
    
    // 2. Obtener la URL relativa (ej: /uploads/images-...)
    const imagenUrlRelativa = imagenObjeto?.url;
  
    // 3. Construir la URL final (con fallback)
    const finalSrc = imagenUrlRelativa 
        ? `${API_BASE_URL}${imagenUrlRelativa}` 
        : DEFAULT_IMAGE_URL;

    console.log(API_BASE_URL, imagenUrlRelativa);

    // Estados para la selección de variantes
    const [selectedVariant, setSelectedVariant] = useState(producto?.variantes?.[0]);

    // Establecer la variante seleccionada inicial al cargar el producto
    useEffect(() => {
        if (producto && producto.variantes && producto.variantes.length > 0) {
            setSelectedVariant(producto.variantes[0]);
        }
    }, [producto]);

    const handleVote = async () => {
        if (hasVoted) return;

        try {
            const response = await fetch(`${BASE_URL_API}/productos/vote/${producto.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Fallo al registrar el voto');
            }

            const data = await response.json();
            setCurrentRating(data.newRating);
            setHasVoted(true);
            
        } catch (error) {
            console.error("Error al votar:", error);
        }
    };


    if (isLoading) return <div>Cargando detalles del producto...</div>;
    if (error) return <div>{error}</div>; 
    if (!producto) return <div>Producto no encontrado (Verifica ID).</div>;

    return (
        <div className={styles.productoDetalleGrid}>
            
            {/* 1. Carrusel/Galería de Imágenes */}
            <div className={styles.galeriaImagenes}>
                {/* Usamos la imagen principal que extrajimos */}
                <Image 
                    src={finalSrc} 
                    alt={`Imagen de ${producto.nombre}`} 
                    width={500} 
                    height={500} 
                    style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
                />
            </div>

            {/* 2. Información Principal */}
            <div className={styles.infoPrincipal}>
                <h1>{producto.nombre}</h1>
                
                <p className={styles.precio}>${(parseFloat(precioPrincipal)?.toFixed(2) || '0.00')}</p>
                <p className={styles.descripcion}>{producto.descripcion || 'Sin descripción.'}</p>
                
                {/* 3. Contenedor de Opciones (Variantes) */}
                <div className={styles.opcionesVariantes}>
                    <h3>Opciones Disponibles:</h3>
                    
                    {/* Agrupador de Variantes */}
                    <div className={styles.variantesContenedor}>
                        
                        {/* Mapear sobre el array de variantes */}
                        {producto.variantes.map((variante) => (
                            <button
                                key={variante.id}
                                className={`${styles.varianteBoton} ${selectedVariant?.id === variante.id ? styles.varianteSelected : ''}`}
                                onClick={() => setSelectedVariant(variante)}
                                // Podrías deshabilitar el botón si stock es 0
                                disabled={variante.stock === 0} 
                            >
                                {variante.color} / {variante.talla} 
                                {/* Mostrar stock (opcional) */}
                                {variante.stock > 0 && <span> ({variante.stock} en stock)</span>}
                                {variante.stock === 0 && <span> (Agotado)</span>}
                            </button>
                        ))}
                        
                    </div>
                </div>

                <div className={styles.infoPrincipal}>
                  <h1>{producto.nombre}</h1>
                  <p className={styles.sku}>SKU: {producto.sku}</p>
    
                  {/* 📌 RENDERIZADO DEL VOTO */}
                  <div className={styles.voteContainer}>
                    <span className={styles.ratingCount}>{currentRating} Likes</span>
                    <span 
                    onClick={handleVote} 
                    className={`${styles.heartIcon} ${hasVoted ? styles.heartFilled : ''}`}
                    title={hasVoted ? "Ya votaste" : "Me gusta"}
                    >
                      {hasVoted ? '❤️' : '🤍'} 
                    </span>
                  </div>
    
                  {/* <p className={styles.precio}>${precioSimple}</p>
                   ... (resto de la info, tabla de variantes, etc.) ... */}
                </div>
                
                {/* 4. Área de Compra */}
                {/* ... (Tu input y botón de agregar al carrito) ... */}
            </div>
        </div>
    );
}
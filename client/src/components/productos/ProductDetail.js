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

// components/productos/ProductDetail.js
'use client'; 
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { useCart } from '@/components/context/CartContext'; // Corregí la ruta de importación
import styles from './ProductoDetail.module.css'; 

const BASE_URL_API = 'http://localhost:4000/api/v1'; 
const API_BASE_URL = 'http://localhost:4000'
const DEFAULT_IMAGE_URL = '/assests/Placeholder.svg';

export default function ProductDetail({ productoId }) {
    const { addItemToCart } = useCart();
    
    const [producto, setProducto] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para la selección de variantes
    const [selectedTalla, setSelectedTalla] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1); 
    
    // Estados de votación
    const [currentRating, setCurrentRating] = useState(0); 
    const [hasVoted, setHasVoted] = useState(false);

    // ------------------------------------------
    // Lógica de Carga de Datos (Server-Side approach is better, but this works)
    // ------------------------------------------
    useEffect(() => {
        const loadProduct = async () => {
            setIsLoading(true);
            setError(null);
            
            const url = `${BASE_URL_API}/productos/${productoId}`; 

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Producto no encontrado (ID: ${productoId})`);
                }
                const data = await response.json();
                
                // 📌 INICIALIZACIÓN: Establecer el rating y el producto
                setProducto(data);
                setCurrentRating(data.rating || 0);

            } catch (error) {
                console.error("Error fetching product detail:", error);
                setProducto(null); 
                setError(error.message || "Error desconocido al cargar el producto.");
            } finally {
                setIsLoading(false);
            }
        };
        
        if (productoId) {
            loadProduct();
        }
        
    }, [productoId]); 

    // ------------------------------------------
    // LÓGICA MEMORIZADA: Encuentra la variante coincidente
    // ------------------------------------------
    const varianteSeleccionada = useMemo(() => {
        // La validación de !producto se hace en el renderizado inferior.
        if (!producto || !producto.variantes || !selectedTalla || !selectedColor) {
            return null; 
        }
        
        return producto.variantes.find(
            v => v.talla === selectedTalla && v.color === selectedColor
        );
    }, [producto, selectedTalla, selectedColor]);

    // ------------------------------------------
    // LÓGICA DE VOTACIÓN (No modificada)
    // ------------------------------------------
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

    // ------------------------------------------
    // LÓGICA DE AÑADIR AL CARRITO (CORREGIDA)
    // ------------------------------------------
    const handleAddToCart = () => {
        if (!selectedTalla || !selectedColor) {
            alert('Por favor, selecciona una Talla y un Color antes de añadir al carrito.');
            return;
        }
        if (!varianteSeleccionada) {
            alert('La combinación de Talla y Color seleccionada no está disponible.');
            return;
        }
        if (quantity <= 0) {
            alert('La cantidad debe ser mayor a cero.');
            return;
        }

        // 🚨 CRÍTICO: Usar la VARIANTE SELECCIONADA, no el producto padre
        // La lógica de CartContext.js debe usar: variante.id, variante.precio, etc.
        addItemToCart(varianteSeleccionada, quantity, finalSrc); 
        
        alert(`¡${quantity}x ${varianteSeleccionada.talla}/${varianteSeleccionada.color} añadido!`);
    };

    // ------------------------------------------
    // Renderizado de Selectores (Optimizados)
    // ------------------------------------------

    // Usamos Set para obtener listas únicas de tallas y colores disponibles
    const availableTallas = useMemo(() => {
        if (!producto || !producto.variantes) return [];
        return [...new Set(producto.variantes.map(v => v.talla))];
    }, [producto]);

    const availableColores = useMemo(() => {
        if (!producto || !producto.variantes) return [];
        // Filtra colores disponibles basados en la talla actual para un mejor UX
        return [...new Set(producto.variantes
            .filter(v => !selectedTalla || v.talla === selectedTalla)
            .map(v => v.color))];
    }, [producto, selectedTalla]);

    // Lógica para construir la URL de la imagen
    const imagenObjeto = producto?.imagenesProducto?.[0];

    // 2. Obtener la URL relativa (ej: /uploads/images-...)

    const imagenUrlRelativa = imagenObjeto?.url;

    // 3. Construir la URL final (con fallback)
    const finalSrc = imagenUrlRelativa 
        ? `${API_BASE_URL}${imagenUrlRelativa}` 
        : DEFAULT_IMAGE_URL;

    // ------------------------------------------
    // Renderizado Condicional
    // ------------------------------------------

    if (isLoading) return <div className={styles.loadingMessage}>Cargando detalles del producto...</div>;
    if (error) return <div className={styles.errorMessage}>{error}</div>; 
    if (!producto) return <div className={styles.errorMessage}>Producto no encontrado.</div>;

    // El precio mostrado será el de la variante seleccionada, o el primero, o 0.
    const displayPrice = varianteSeleccionada?.precio || producto?.variantes?.[0]?.precio || 0;

    return (
        <div className={styles.productoDetalleGrid}>
            
            {/* 1. Carrusel/Galería de Imágenes */}
            <div className={styles.galeriaImagenes}>
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
                <p className={styles.sku}>SKU: {producto.sku}</p>

                {/* 📌 PRECIO DINÁMICO */}
                <p className={styles.precio}>${(parseFloat(displayPrice)?.toFixed(2) || '0.00')}</p>
                <p className={styles.descripcion}>{producto.descripcion || 'Sin descripción.'}</p>
                
                {/* Voto */}
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
                
                {/* ----------------- SELECTORES ----------------- */}
                <div className={styles.opcionesCompra}>
                    
                    {/* SELECTOR DE TALLA */}
                    <div className={styles.selectGroup}>
                        <label>Talla:</label>
                        <select onChange={(e) => setSelectedTalla(e.target.value)} value={selectedTalla || ''}>
                            <option value="" disabled>Selecciona una Talla</option>
                            {availableTallas.map(talla => (
                                <option key={talla} value={talla}>{talla}</option>
                            ))}
                        </select>
                    </div>

                    {/* SELECTOR DE COLOR */}
                    <div className={styles.selectGroup}>
                        <label>Color:</label>
                        <select onChange={(e) => setSelectedColor(e.target.value)} value={selectedColor || ''}>
                            <option value="" disabled>Selecciona un Color</option>
                            {availableColores.map(color => (
                                <option key={color} value={color}>{color}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                {/* 📌 MENSAJE DE SELECCIÓN FALTANTE */}
                {!varianteSeleccionada && selectedTalla && selectedColor && (
                    <p className={styles.warningMessage}>Combinación no disponible.</p>
                )}

                {/* 4. Área de Compra */}
                <div className={styles.productActions}>
                  {/* Input de Cantidad */}
                  <input 
                      type="number" 
                      value={quantity} 
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      className={styles.quantityInput}
                  />
                  {/* Botón de Añadir */}
                  <button 
                      className={styles.addToCartButton} 
                      onClick={handleAddToCart}
                      disabled={!varianteSeleccionada || quantity <= 0} // Deshabilitar si no hay variante o cantidad inválida
                  >
                      Añadir al Carrito
                  </button>
                </div>
            </div>
        </div>
    );
}
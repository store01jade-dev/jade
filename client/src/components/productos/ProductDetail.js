// components/productos/ProductDetail.js
'use client'; 
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { useCart } from '@/components/context/CartContext'; 
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

    // NUEVO ESTADO CRÍTICO: Precio que realmente se muestra
    const [precioVisible, setPrecioVisible] = useState(0); 
    
    // Estado para la imagen principal seleccionada
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // ------------------------------------------
    // Lógica de Carga de Datos
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
                
                // INICIALIZACIÓN: Establecer el rating y el producto
                setProducto(data);
                setCurrentRating(data.rating || 0);

                // 📌 INICIALIZACIÓN DEL PRECIO: Usar precio_base por defecto
                const basePrice = parseFloat(data.precio_base) || 0;
                setPrecioVisible(basePrice);
                
                // 📌 INICIALIZACIÓN DE IMAGEN: Seleccionar la imagen principal
                const principalIndex = data.imagenesProducto?.findIndex(img => img.principal === true);
                setSelectedImageIndex(principalIndex !== -1 ? principalIndex : 0);


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
        if (!producto || !producto.variantes || !selectedTalla || !selectedColor) {
            return null; 
        }
        
        return producto.variantes.find(
            v => v.talla === selectedTalla && v.color === selectedColor
        );
    }, [producto, selectedTalla, selectedColor]);


    // ------------------------------------------
    // 📌 LÓGICA DINÁMICA DEL PRECIO
    // ------------------------------------------
    useEffect(() => {
        if (!producto) return;

        const basePrice = parseFloat(producto.precio_base) || 0;

        // Intentamos obtener el precio de la variante seleccionada
        const variantPrice = parseFloat(varianteSeleccionada?.precio);

        // REGLA: Si hay una variante seleccionada Y tiene un precio válido (> 0)
        if (varianteSeleccionada && !isNaN(variantPrice) && variantPrice > 0) {
            // Usar el precio de la variante
            setPrecioVisible(variantPrice);
        } else {
            // En cualquier otro caso, usar el precio base
            setPrecioVisible(basePrice);
        }
        
    }, [varianteSeleccionada, producto]); 

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
    // LÓGICA DE AÑADIR AL CARRITO (Asegura la estructura correcta)
    // ------------------------------------------
    
    const hasVariantes = producto?.variantes?.length > 0;
    
    const handleAddToCart = () => {
        if (quantity <= 0) {
            alert('La cantidad debe ser mayor a cero.');
            return;
        }

        let itemToAdd = null;
        
        // CASO A: Producto CON variantes
        if (hasVariantes) {
            if (!selectedTalla || !selectedColor) {
                alert('Por favor, selecciona Talla y Color antes de añadir.');
                return;
            }
            if (!varianteSeleccionada) {
                 alert('La combinación seleccionada no está disponible.');
                 return;
            }
            // CRÍTICO: Aseguramos que el precio que se añade al carrito es el precio final visible
            itemToAdd = { ...varianteSeleccionada, precio: precioVisible }; 
        } 
        // CASO B: Producto SIN variantes
        else {
            const basePrice = parseFloat(producto.precio_base);

            if (isNaN(basePrice) || basePrice <= 0) {
                alert('Este producto no tiene precio de venta válido.');
                return;
            }
            
            // Creamos una "variante" con la estructura necesaria para CartContext
            itemToAdd = {
                id: producto.id, 
                nombre: producto.nombre,
                talla: null, 
                color: null, 
                precio: basePrice, 
                sku: producto.id.toString(), 
            };
        }

        // --- Obtener Imagen URL ---
        const imagenObjeto = producto?.imagenesProducto?.find((_, index) => index === selectedImageIndex) || producto?.imagenesProducto?.[0];
        const finalSrc = imagenObjeto?.url ? `${API_BASE_URL}${imagenObjeto.url}` : DEFAULT_IMAGE_URL;

        // 3. Añadir al carrito
        addItemToCart(itemToAdd, quantity, finalSrc); 
        
        const itemDescription = hasVariantes 
            ? `${itemToAdd.talla}/${itemToAdd.color}` 
            : `(Unidad)`;

        alert(`¡${quantity}x ${producto.nombre} ${itemDescription} añadido!`);
    };

    // ------------------------------------------
    // Renderizado de Selectores (Optimizados)
    // ------------------------------------------

    const availableTallas = useMemo(() => {
        if (!producto || !producto.variantes) return [];
        return [...new Set(producto.variantes.map(v => v.talla))];
    }, [producto]);

    const availableColores = useMemo(() => {
        if (!producto || !producto.variantes) return [];
        return [...new Set(producto.variantes
            .filter(v => !selectedTalla || v.talla === selectedTalla)
            .map(v => v.color))];
    }, [producto, selectedTalla]);

    // ------------------------------------------
    // Renderizado Condicional y Formato
    // ------------------------------------------

    if (isLoading) return <div className={styles.loadingMessage}>Cargando detalles del producto...</div>;
    if (error) return <div className={styles.errorMessage}>{error}</div>; 
    if (!producto) return <div className={styles.errorMessage}>Producto no encontrado.</div>;

    // Formato del precio
    const formattedPrice = parseFloat(precioVisible);
    const priceDisplay = isNaN(formattedPrice) || formattedPrice <= 0 
        ? 'N/A' 
        : `$${formattedPrice.toFixed(2)}`;

    // 📌 Lógica para obtener todas las URLs de imágenes (con Cache-Busting)
    const allImageUrls = producto?.imagenesProducto?.map(img => {
        const imageUpdateTimestamp = new Date(img.updatedAt).getTime();
        // Aplicamos Cache-Busting: el timestamp cambia si la imagen es actualizada.
        return `${API_BASE_URL}${img.url}?v=${imageUpdateTimestamp}`; 
    }) || [DEFAULT_IMAGE_URL];

    const currentImageUrl = allImageUrls[selectedImageIndex] || DEFAULT_IMAGE_URL;

    const basePriceValid = parseFloat(producto?.precio_base) > 0;

    const isPurchaseValid = hasVariantes 
        ? (varianteSeleccionada !== null)
        : basePriceValid;

    return (
        <div className={styles.productoDetalleGrid}>
            
            {/* 1. Carrusel/Galería de Imágenes */}
            <div className={styles.galeriaWrapper}> 
                
                {/* Miniaturas de Navegación */}
                <div className={styles.miniaturas}>
                    {allImageUrls.map((url, index) => (
                        <div 
                            key={index} 
                            className={`${styles.miniaturaItem} ${index === selectedImageIndex ? styles.activeMin : ''}`}
                            onClick={() => setSelectedImageIndex(index)}
                        >
                            <Image 
                                src={url} 
                                alt={`Vista ${index + 1}`} 
                                width={100} 
                                height={100} 
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    ))}
                </div>

                {/* Imagen Principal */}
                <div className={styles.galeriaImagenes}>
                    <Image 
                        src={currentImageUrl} 
                        alt={`Imagen de ${producto.nombre}`} 
                        width={600} 
                        height={600} 
                        style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
                    />
                </div>
            </div>

            {/* 2. Información Principal */}
            <div className={styles.infoPrincipal}>
                
                {/* 1. Título */}
                <h1>{producto.nombre}</h1>

                {/* 2. PRECIO DINÁMICO */}
                <p className={styles.precio}>{priceDisplay}</p>
                
                {/* 3. Descripción */}
                <p className={styles.descripcion}>{producto.descripcion || 'Sin descripción.'}</p>
                
                {/* ----------------- SELECTORES ----------------- */}
                {producto.variantes.length > 0 && (
                <div className={styles.opcionesCompra}>
                    {/* SELECTOR DE TALLA */}
                    <div className={styles.selectGroup}>
                        <label>Talla:</label>
                        <select 
                            onChange={(e) => {
                                setSelectedTalla(e.target.value);
                                // 📌 MEJORA UX: Resetear color al cambiar talla
                                setSelectedColor(null); 
                            }} 
                            value={selectedTalla || ''}
                        >
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
                )}
                
                {/* MENSAJE DE SELECCIÓN FALTANTE */}
                {!varianteSeleccionada && selectedTalla && selectedColor && (
                    <p className={styles.warningMessage}>Combinación no disponible.</p>
                )}

                {/* 4. ÁREA DE COMPRA Y ACCIÓN */}
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
                      disabled={!isPurchaseValid || quantity <= 0} 
                  >
                      Añadir al Carrito
                  </button>
                  
                  {/* BOTÓN DE VOTO */}
                  <div className={styles.voteContainer}>
                      <span 
                      onClick={handleVote} 
                      className={`${styles.heartIcon} ${hasVoted ? styles.heartFilled : ''}`}
                      title={hasVoted ? "Ya votaste" : "Me gusta"}
                      >
                        {hasVoted ? '❤️' : '🤍'} 
                      </span>
                      <span className={styles.ratingCount}>{currentRating}</span>
                  </div>
                </div>

                {/* 5. SKU 
                <p className={styles.skuReference}>SKU: {producto.sku}</p>
                */}
            </div>
        </div>
    );
}
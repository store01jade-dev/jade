// components/productos/ProductDetail.js
'use client'; 
import Image from 'next/image';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useCart } from '@/components/context/CartContext'; 
import styles from './ProductoDetail.module.css'; 
import sizeGuideImg from '../../../public/assests/guiaTallas.png';

const BASE_URL_API = process.env.NEXT_PUBLIC_API_URL; 
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
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
    
    // Estado para la imagen principal seleccionada (usado solo para navegación de escritorio)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Referencia al contenedor de imágenes grandes
    const galeriaRef = useRef(null);

    // ------------------------------------------
    // Lógica de Carga de Datos
    // ------------------------------------------
    useEffect(() => {
        const loadProduct = async () => {
            setIsLoading(true);
            setError(null);
            
            const url = `${BASE_URL_API}/api/v1/productos/${productoId}`; 

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Producto no encontrado (ID: ${productoId})`);
                }
                const data = await response.json();
                
                // INICIALIZACIÓN: Establecer el rating y el producto
                setProducto(data);
                setCurrentRating(data.rating || 0);

                // INICIALIZACIÓN DEL PRECIO: Usar precio_base por defecto
                const basePrice = parseFloat(data.precio_base) || 0;
                setPrecioVisible(basePrice);
                
                // INICIALIZACIÓN DE IMAGEN: Seleccionar la imagen principal
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
          const response = await fetch(`${BASE_URL_API}/api/v1/productos/vote/${producto.id}`, { 
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
        //const finalSrc = imagenObjeto?.url ? `${API_BASE_URL}${imagenObjeto.url}` : DEFAULT_IMAGE_URL;
        // Lógica inteligente también aquí al añadir:
        const finalSrc = imagenObjeto?.url.startsWith('http') 
            ? imagenObjeto.url 
            : `${API_BASE_URL}${imagenObjeto.url}`;

        // 3. Añadir al carrito
        addItemToCart(itemToAdd, producto.nombre, quantity, finalSrc); 
        
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

    // Lógica para obtener todas las URLs de imágenes (con Cache-Busting)
    const allImageUrls = producto?.imagenesProducto?.map(img => {
        /*const imageUpdateTimestamp = new Date(img.updatedAt).getTime();
        // Aplicamos Cache-Busting: el timestamp cambia si la imagen es actualizada.
        return `${API_BASE_URL}${img.url}?v=${imageUpdateTimestamp}`;*/

        // Si la URL ya empieza con http, la usamos directamente (Cloudinary)
        // Si no, le concatenamos la base (para compatibilidad con imágenes viejas)
        const isExternal = img.url.startsWith('http');
        const finalUrl = isExternal ? img.url : `${API_BASE_URL}${img.url}`;
        
        // El Cache-Busting solo es necesario para imágenes locales, 
        // Cloudinary maneja su propio versionado, pero podemos dejarlo.
        const imageUpdateTimestamp = new Date(img.updatedAt).getTime();
        return isExternal ? finalUrl : `${finalUrl}?v=${imageUpdateTimestamp}`;
        
    }) || [DEFAULT_IMAGE_URL];

    // Esta variable solo se usa ahora para el modo escritorio/miniatura
    const currentImageUrl = allImageUrls[selectedImageIndex] || DEFAULT_IMAGE_URL; 

    const basePriceValid = parseFloat(producto?.precio_base) > 0;

    const isPurchaseValid = hasVariantes 
        ? (varianteSeleccionada !== null)
        : basePriceValid;
    
    // Lógica de navegación de botones
    const totalImages = allImageUrls.length;
    
    // Manejador para desplazamiento (útil para botones y scroll snap)
    const handleScroll = (direction) => {
        if (!galeriaRef.current) return;

        const scrollWidth = galeriaRef.current.clientWidth; // Ancho de una imagen
        
        // Calcula el nuevo índice basado en la dirección
        let newIndex = selectedImageIndex + direction;
        
        // Limita el índice
        newIndex = Math.max(0, Math.min(totalImages - 1, newIndex));
        setSelectedImageIndex(newIndex); // Actualiza el estado para saber dónde estamos

        // SCROLL JAVASCRIPT: Mueve el scroll del contenedor
        galeriaRef.current.scrollLeft = newIndex * scrollWidth;
    };

    return (
        <div className={styles.productoDetalleGrid}>
            
            <div className={styles.galeriaWrapper}> 
            
                {/* 1. Miniaturas de Navegación (Se mantiene igual) */}
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

                {/* SOLUCIÓN: Usamos UN SOLO contenedor para carrusel y botones */}
                <div className={styles.carruselContainer}> 
                    
                    {/* 2. Botones de Navegación (para Móvil) */}
                    {/* Botón Atrás (Visible si no estamos en la primera imagen) */}
                    {selectedImageIndex > 0 && (
                        <button 
                            className={`${styles.navButton} ${styles.prevButton}`} 
                            onClick={() => handleScroll(-1)}
                        >
                            {'<'}
                        </button>
                    )}

                    {/* 3. IMÁGENES PRINCIPALES (Carrusel/Galería) */}
                    {/* Aquí colocamos la referencia para el transform/scroll */}
                    <div className={styles.galeriaImagenes} ref={galeriaRef}>
                        {/* SOLUCIÓN para DESKTOP: Renderizar solo la imagen de índice seleccionado */}
                        {window.innerWidth > 760 ? (
                            <Image 
                                src={currentImageUrl} 
                                alt={`Imagen de ${producto.nombre} - Vista ${selectedImageIndex + 1}`} 
                                width={600} 
                                height={600} 
                                style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
                            />
                        ) : (
                            // SOLUCIÓN para MOBILE: Volver a mapear todas las imágenes para el carrusel de scroll
                            allImageUrls.map((url, index) => (
                                <Image 
                                    key={index}
                                    src={url} 
                                    alt={`Vista ${index + 1} de ${producto.nombre}`} 
                                    width={600} 
                                    height={600} 
                                    style={{ objectFit: 'contain' }}
                                />
                            ))
                        )}
                    </div>

                    {/* Botón Adelante (Visible si no estamos en la última imagen) */}
                    {selectedImageIndex < totalImages - 1 && (
                        <button 
                            className={`${styles.navButton} ${styles.nextButton}`} 
                            onClick={() => handleScroll(1)}
                        >
                            {'>'}
                        </button>
                    )}
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
                                // Resetear color al cambiar talla
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
                        <button 
                            type="button" // Evita que intente enviar un formulario
                            onClick={(e) => {
                                e.preventDefault(); // Evita cualquier comportamiento extraño
                                console.log("Clic detectado en el corazón"); // Para probar en consola
                                handleVote();
                            }} 
                            className={`${styles.voteButton} ${hasVoted ? styles.heartFilled : ''}`}
                            title={hasVoted ? "Ya votaste" : "Me gusta"}
                            disabled={hasVoted} // Desactiva el botón si ya votó
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                cursor: hasVoted ? 'default' : 'pointer',
                                fontSize: '1.5rem' 
                            }}
                        >
                            {hasVoted ? '❤️' : '🤍'} 
                        </button>
                        <span className={styles.ratingCount}>{currentRating}</span>
                    </div>
                </div>

                {/* SECCIÓN DE GUÍA DE TALLAS */}
                <section className={styles.sizeGuideContainer}>
                    <h3 className={styles.sizeGuideTitle}>Guía de Tallas</h3>
                    
                    <div className={styles.imageWrapper}>
                        <Image 
                            src={sizeGuideImg} 
                            alt="Guía de tallas Tienda Jade"
                            width={500}
                            height={400}
                            style={{ width: '100%', height: 'auto' }} // Mantiene proporción
                            placeholder="blur" // Opcional: para carga elegante
                        />
                    </div>

                    <p className={styles.sizeGuideText}>
                        * Las medidas son aproximadas. Si tienes dudas, contáctanos.
                    </p>
                </section>

                {/* 5. SKU 
                <p className={styles.skuReference}>SKU: {producto.sku}</p>
                */}
            </div>
        </div>
    );
}
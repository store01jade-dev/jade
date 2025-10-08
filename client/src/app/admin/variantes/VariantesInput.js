// components/admin/VariantesInput.js

import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import styles from './VariantesInput.module.css'; // <-- Importamos los estilos

const VariantesInput = ({ variantes, setVariantes }) => {
    
    const addVariante = () => {
        // Inicializar con valores base
        setVariantes([...variantes, { sku: '', talla: '', color: '', stock: 0, precio: 0, peso: 0 }]); 
    };

    const handleVarianteChange = (index, name, value) => {
        const newVariantes = [...variantes];
        let processedValue;
        
        // Convertir a número si es stock, precio, o peso
        if (name === 'stock' || name === 'precio' || name === 'peso') {
            processedValue = value === '' ? 0 : parseFloat(value);
        } else {
            processedValue = value;
        }
        
        newVariantes[index][name] = processedValue;
        setVariantes(newVariantes);
    };

    const removeVariante = (index) => {
        const newVariantes = variantes.filter((_, i) => i !== index);
        setVariantes(newVariantes);
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.heading}>Opciones de Variantes</h3>
            
            <button type="button" onClick={addVariante} className={styles.addButton}>
                <FaPlus style={{ marginRight: '8px' }} /> Añadir Variante
            </button>

            {variantes.map((variante, index) => (
                <div key={index} className={styles.row}>
                    {/* SKU */}
                    <input type="text" placeholder="SKU" name="sku" value={variante.sku} onChange={(e) => handleVarianteChange(index, e.target.name, e.target.value)} required className={styles.input} title="SKU es obligatorio" />
                    
                    {/* TALLA */}
                    <input type="text" placeholder="Talla" name="talla" value={variante.talla} onChange={(e) => handleVarianteChange(index, e.target.name, e.target.value)} className={styles.input} />
                    
                    {/* COLOR */}
                    <input type="text" placeholder="Color" name="color" value={variante.color} onChange={(e) => handleVarianteChange(index, e.target.name, e.target.value)} className={styles.input} />
                    
                    {/* STOCK */}
                    <input type="number" placeholder="Stock" name="stock" value={variante.stock} onChange={(e) => handleVarianteChange(index, e.target.name, e.target.value)} required min="0" className={styles.input} />
                    
                    {/* PRECIO */}
                    <input type="number" placeholder="Precio ($)" name="precio" value={variante.precio} onChange={(e) => handleVarianteChange(index, e.target.name, e.target.value)} required min="0.01" step="0.01" className={styles.input} />
                    
                    {/* PESO (Añadido por si es relevante para el envío) */}
                    <input type="number" placeholder="Peso (kg)" name="peso" value={variante.peso} onChange={(e) => handleVarianteChange(index, e.target.name, e.target.value)} min="0" step="0.01" className={styles.input} />
                    
                    {/* BOTÓN DE ELIMINAR */}
                    <button type="button" onClick={() => removeVariante(index)} className={styles.removeButton}>
                        <FaTrash />
                    </button>
                </div>
            ))}

            {variantes.length === 0 && (
                <p className={styles.emptyMessage}>
                    Agrega al menos una variante si este producto tiene opciones específicas.
                </p>
            )}
        </div>
    );
};

export default VariantesInput;
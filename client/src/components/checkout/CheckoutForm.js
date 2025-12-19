// src/components/checkout/CheckoutForm.js
'use client';
import React, { useState, useEffect } from 'react';
import styles from './CheckoutForm.module.css';



const initialFormData = {
    nombreCompleto: '',
    documentoIdentidad:'',
    telefono: '',
    direccion: '',
    barrio:'',
    ciudad: '',
    notas: '', // Notas de entrega opcionales
    metodoPago: 'contra_entrega', // Valor por defecto
};

export default function CheckoutForm({ onSubmit, isProcessing, userData }) {
    const [formData, setFormData] = useState(initialFormData);

    // Efecto para autocompletar si hay datos de usuario
    useEffect(() => {
        if (userData) {
            setFormData(prevData => ({
                ...prevData,
                // Asume que tu objeto 'user' tiene 'nombre' y 'telefono'
                nombreCompleto: userData.nombre || prevData.nombreCompleto,
                email: userData.email || prevData.email,
                // Nota: La dirección y teléfono generalmente se cargan de un perfil si existen
            }));
        }
    }, [userData]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Aquí puedes añadir validaciones básicas antes de enviar
        if (!formData.nombreCompleto || !formData.documentoIdentidad || !formData.direccion || !formData.ciudad) {
            alert('Por favor, completa los campos obligatorios (*).');
            return;
        }

        // Llamar a la función onSubmit pasada desde CheckoutPage
        onSubmit(formData);
    };

    

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.section}>
                <h3>Datos de Contacto y Envío</h3>
                
                {/* 1. Nombre Completo */}
                <div className={styles.formGroup}>
                    <label htmlFor="nombreCompleto">Nombre Completo *</label>
                    <input
                        type="text"
                        id="nombreCompleto"
                        name="nombreCompleto"
                        value={formData.nombreCompleto}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        disabled={isProcessing}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="documentoIdentidad">Cédula o NIT *</label>
                    <input type="text" id="documentoIdentidad" name="documentoIdentidad" value={formData.documentoIdentidad} onChange={handleChange} required className={styles.input} disabled={isProcessing} placeholder="Para la guía de envío" />
                </div>

                {/* 2. Teléfono */}
                <div className={styles.formGroup}>
                    <label htmlFor="telefono">Teléfono *</label>
                    <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        disabled={isProcessing}
                    />
                </div>
            </div>

            <div className={styles.section}>
                <h3>Dirección</h3>
                
                {/* 3. Dirección de Envío */}
                <div className={styles.formGroup}>
                    <label htmlFor="direccion">Dirección (Calle, Número, Apto/Casa) *</label>
                    <input
                        type="text"
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        disabled={isProcessing}
                    />
                </div>

                {/* Grid para Ciudad y Código Postal */}
                <div className={styles.addressGrid}>
                    <div className={styles.formGroup}>
                        <label htmlFor="ciudad">Ciudad *</label>
                        <input
                            type="text"
                            id="ciudad"
                            name="ciudad"
                            value={formData.ciudad}
                            onChange={handleChange}
                            required
                            className={styles.input}
                            disabled={isProcessing}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="barrio">Barrio *</label>
                        <input type="text" id="barrio" name="barrio" value={formData.barrio} onChange={handleChange} required className={styles.input} disabled={isProcessing} />
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h3>Notas de Entrega (Opcional)</h3>
                <div className={styles.formGroup}>
                    <textarea
                        id="notas"
                        name="notas"
                        rows="3"
                        value={formData.notas}
                        onChange={handleChange}
                        className={styles.input}
                        disabled={isProcessing}
                        placeholder="Ej: Entregar al portero, llamar 10 minutos antes."
                    />
                </div>
            </div>

            <div className={styles.section}>
                <h3>Método de Pago</h3>
                <div className={styles.paymentOptions}>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="metodoPago"
                            value="contra_entrega"
                            checked={formData.metodoPago === 'contra_entrega'}
                            onChange={handleChange}
                        />
                        Pago contra entrega (Efectivo)
                    </label>

                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="metodoPago"
                            value="online"
                            checked={formData.metodoPago === 'online'}
                            onChange={handleChange}
                        />
                        Pago en línea (Tarjeta/PSE)
                    </label>
                </div>
            </div>


            <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isProcessing}
            >
                {isProcessing ? 'Procesando Pedido...' : 'Continuar y Pagar'}
            </button>
        </form>
    );
}
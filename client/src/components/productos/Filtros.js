'use client';

import React from 'react';
// 📌 Importar los estilos del MÓDULO DE FILTROS
import styles from './Filtros.module.css'; 

export default function Filtros({ filtros, setFiltros, categorias }) {
  
  return (
    <div className={styles.filtrosContainer}>
      <h4 className="text-lg font-semibold mb-3">Filtros de Búsqueda</h4>
      
      {/* Usamos las clases del módulo Filtros */}
      <div className={styles.filtrosInnerWrapper}> 
        
        {/* Filtro por Nombre */}
        <div className={styles.filtroItem}>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
          <input
            type="text"
            id="nombre"
            value={filtros.nombre}
            onChange={(e) => setFiltros({...filtros, nombre: e.target.value})}
            className={styles.inputField}
            placeholder="Buscar por nombre..."
          />
        </div>
        
        {/* Filtro por Categoría */}
        <div className={styles.filtroItem}>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
          <select
            id="categoria"
            value={filtros.categoria}
            onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
            className={styles.inputField}
          >
            <option value="">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>
        
        {/* Filtros por Precio */}
        <div className={styles.precioRangeWrapper}> 
          <div className={styles.filtroItem}>
            <label htmlFor="precioMin" className="block text-sm font-medium text-gray-700">Precio Mínimo</label>
            <input
              type="number"
              id="precioMin"
              value={filtros.precioMin}
              onChange={(e) => setFiltros({...filtros, precioMin: parseFloat(e.target.value) || 0})}
              className={styles.inputField}
              min="0"
            />
          </div>
          <div className={styles.filtroItem}>
            <label htmlFor="precioMax" className="block text-sm font-medium text-gray-700">Precio Máximo</label>
            <input
              type="number"
              id="precioMax"
              value={filtros.precioMax}
              onChange={(e) => setFiltros({...filtros, precioMax: parseFloat(e.target.value) || 1000})}
              className={styles.inputField}
              min="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// context/CommentRefreshContext.js
'use client';

import React, { createContext, useContext, useState } from 'react';

const CommentRefreshContext = createContext();

// Hook para acceder al contexto
export const useCommentRefresh = () => {
    // Si intentan usar el hook sin el Provider, lanzamos un error
    const context = useContext(CommentRefreshContext);
    if (!context) {
        throw new Error('useCommentRefresh debe usarse dentro de un CommentRefreshProvider');
    }
    return context;
};

// Componente Proveedor
export function CommentRefreshProvider({ children }) {
    const [refreshKey, setRefreshKey] = useState(0);

    const triggerRefresh = () => {
        // Incrementa el estado para forzar la re-renderización de los consumidores
        setRefreshKey(prevKey => prevKey + 1);
    };

    return (
        <CommentRefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
            {children}
        </CommentRefreshContext.Provider>
    );
}
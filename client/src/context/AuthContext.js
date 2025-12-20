// context/AuthContext.js
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Hook de Next.js para redirección

// 1. Crear el Contexto
const AuthContext = createContext();

// URL base de tu backend de Express
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/users'; 

// 2. Crear el Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Contiene { id, email, rol, nombre }
  const [token, setToken] = useState(null); // Contiene el JWT
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Función auxiliar para decodificar el JWT (solo estructura)
  const decodeToken = (jwtToken) => {
    // Aquí podrías usar una librería como 'jwt-decode' para obtener el payload
    // Por ahora, solo devolvemos un objeto de usuario simulado
    try {
        const base64Url = jwtToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        const { id, rol } = payload; 

        if (!id || !rol) {
            console.error("Payload válido, pero faltan propiedades (ID o ROL).");
            return null; 
        }

        return {
            id: id, 
            rol: rol, // Asignación limpia y directa.
        };
    } catch (e) {
        console.error("Error al decodificar o parsear el payload:", e);
        return null;
    }
  };

  // 3. Efecto: Cargar Token al montar el componente
useEffect(() => {
    // Si la decodificación falla, queremos que setIsLoading(false) se ejecute.
    let storedToken = null;
    let userData = null;

    if (typeof window !== 'undefined') {
        storedToken = localStorage.getItem('jwtToken');
        
        if (storedToken) {
            try {
                userData = decodeToken(storedToken);
            } catch (e) {
                // Si la decodificación falla, el token está corrupto.
                console.error("Error decodificando token en useEffect:", e);
                localStorage.removeItem('jwtToken');
            }
        }
    }
    
    if (storedToken && userData) {
        setToken(storedToken);
        setUser(userData);
    }
    
    // Garantiza que la carga termina DE ÚLTIMO, sea exitoso o no el token.
    setIsLoading(false);
    
    // No necesitamos el return () => { checkToken = false; } si solo hacemos fetch de localStorage
}, []); 

// 4. Función de LOGIN (Llama a tu API de Express)
const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      const newToken = data.token;
       let userData = null; // <-- DECLARACIÓN INICIAL FUERA DEL ALCANCE INTERNO
        
      // 1. Proteger la interacción con el navegador
      if (typeof window !== 'undefined') {
        localStorage.setItem('jwtToken', newToken);
        setToken(newToken); // Esto es estado de React y no necesita chequeo
            
      // 2. Decodificación protegida
        try {
          userData = decodeToken(newToken);
            if (userData) {
              setUser(userData);
            }
        } catch (e) {
            console.error("Error decodificando el token:", e);
            // Si falla la decodificación, no guardamos el usuario y forzamos logout
            localStorage.removeItem('jwtToken');
        }
      }

      // Aquí es donde ajustamos la redirección:
      const rol = userData?.rol; // Obtener el rol del usuario decodificado
      console.log("Token JWT decodificado - Rol:", rol);
    
      /* Retraso opcional (si lo mantuviste)
      setTimeout(() => {
        if (rol === 'admin') {
            router.push('/admin/dashboard'); // Redirigir al dashboard
        } else {
            router.push('/'); // Redirigir a la página principal para clientes
        }
      }, 50); // Mantenemos el retraso de 50ms para la estabilidad*/

    return { success: true };
    } else {
      return { success: false, error: data.message || 'Error de autenticación' };
    }
 } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Error de conexión con el servidor.' };
  }
};

  // Función de REGISTRO
const register = async (nombre, email, password) => {
    try {
        const response = await fetch(`${API_URL}api/users/register`, { // Asumo esta ruta en tu backend
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // OPTIONAL: Si el registro inicia sesión automáticamente, 
            // puedes llamar a login() aquí o simplemente devolver éxito.
            
            // Para simplicidad, solo devolvemos éxito y el usuario deberá iniciar sesión.
            return { success: true, message: data.message || 'Registro exitoso. Inicie sesión.' };
        } else {
            return { success: false, error: data.message || 'Error al registrar el usuario.' };
        }
    } catch (error) {
        console.error('Register error:', error);
        return { success: false, error: 'Error de conexión con el servidor.' };
    }
};

// 5. Función de LOGOUT
  const logout = () => {
    localStorage.removeItem('jwtToken');
    setToken(null);
    setUser(null);
    // Redirigir a la página de inicio o login
    router.push('/'); 
  };

  
// 6. Valores que el Contexto proporcionará
  const contextValue = {
    user,
    token,
    isAuthenticated: !!user, // Booleano: ¿Hay un usuario logueado?
    isLoading,
    login,
    logout,
    register// Aquí podrías añadir register, cambiar contraseña, etc.
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 7. Hook Personalizado para usar el Contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
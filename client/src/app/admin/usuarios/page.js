'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './AdminUsuarios.module.css';

export default function AdminUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const { token } = useAuth();

    const fetchUsuarios = async () => {
        const res = await fetch('http://localhost:4000/api/users/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        console.log("RESPUESTA BRUTA DEL SERVIDOR:", text);
        setUsuarios(data);
    };

    const handleRoleChange = async (userId, nuevoRol) => {
        // Confirmación opcional para evitar errores accidentales
        if (!window.confirm(`¿Estás seguro de cambiar el rol a ${nuevoRol}?`)) return;

        try {
            const res = await fetch(`http://localhost:4000/api/users/${userId}/role`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ rol: nuevoRol }) // Enviamos 'rol' para que coincida con el controller
            });

            if (res.ok) {
                alert("Rol actualizado con éxito");
                fetchUsuarios(); // Recargamos la lista para ver los cambios
            } else {
                const errorData = await res.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            alert("No se pudo conectar con el servidor");
        }
    };

    useEffect(() => { if (token) fetchUsuarios(); }, [token]);

    return (
        <div className={styles.container}>
            <h2>Gestión de Usuarios</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol Actual</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(u => (
                        <tr key={u.id}>
                            <td>{u.nombre}</td>
                            <td>{u.email}</td>
                            <td><span className={styles[u.rol]}>{u.rol}</span></td>
                            <td>
                                <select 
                                    value={u.rol} 
                                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                >
                                    <option value="user">Usuario</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
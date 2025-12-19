// src/app/perfil/page.js
'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import styles from './Perfil.module.css';

export default function PerfilPage() {
    const { user } = useAuth();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Hola, {user?.nombre || 'Usuario'}</h1>
                <p>Bienvenido a tu panel de control</p>
            </header>

            <div className={styles.grid}>
                <Link href="/mis-pedidos" className={styles.card}>
                    <div className={styles.icon}>📦</div>
                    <h3>Mis Pedidos</h3>
                    <p>Rastrea, gestiona o vuelve a comprar tus productos.</p>
                </Link>

                <Link href="/perfil/editar" className={styles.card}>
                    <div className={styles.icon}>👤</div>
                    <h3>Datos Personales</h3>
                    <p>Edita tu nombre, teléfono y dirección predeterminada.</p>
                </Link>

                <Link href="/perfil/seguridad" className={styles.card}>
                    <div className={styles.icon}>🔒</div>
                    <h3>Seguridad</h3>
                    <p>Cambia tu contraseña y protege tu cuenta.</p>
                </Link>
            </div>
        </div>
    );
}
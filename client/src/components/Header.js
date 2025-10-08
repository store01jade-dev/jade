"use client";

import Link from "next/link";
import { useState ,useEffect } from "react";
import Image from "next/image";
import logo from "../../public/assests/Logo-12.png";
import buscar from "../../public/icons/Search.svg";
import buscarLight from "../../public/icons/SearchLight.svg";
import cart from "../../public/icons/shopingCard.png";
import registro from "../../public/icons/Login.png";
import cerrarSesion from "../../public/icons/Logoutlight.svg";
import style from "./Header.module.css";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const { isAuthenticated, logout, user } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login'); // Redirigir al login después del logout
    };


    

  return (
    <header className={style.header}>
      {/*Izquierda: navegacion logo y catalogo */}
      <nav className={style.log}>
        <Link href="/">
          <Image src={logo} alt="logo-Jade" width={100} height={100} />
        </Link>
        <Link href="/productos">
            <h1>Catalogo</h1>
        </Link>
      </nav>

      {/*Centro: Buscador*/}
      <div className={style.search}>
        <input
            type="text"
            placeholder="Encuentra tu producto"
            value={search}
            onChange={(e)=> setSearch(e.target.value)}
        />
        <button aria-label="Buscar">
            <Image src={buscar} alt="lupa para buscar" width={50} height={50} />
        </button>
      </div>

      {/* Botón lupa móvil */}
      <button className={style.mobileSearchBtn} aria-label="Buscar">
        <Image
            src={buscarLight}
            alt="Buscar"
            width={50}
            height={50}
            className={style.iconMobile}
        />
      </button>

      {/* Botón hamburguesa (solo visible en móvil) */}
      <button className={style.menuButton} onClick={() => setOpen(!open)} aria-label="Abrir menú" >
        <span className={style.bar}></span>
        <span className={style.bar}></span>
        <span className={style.bar}></span>
      </button>

      {/*Derecha: Enlaces de accion */}
      <nav className={style.actions}>
        <Link href="/carrito">
            <Image src={cart} alt="carrito de compras" width={50} height={50} />
        </Link>

        {isAuthenticated ? (
          < >
           {/* Enlaces Específicos del Rol */}
           {user?.rol === 'admin' ? (
              <Link href="/admin/dashboard"><h1>Dashboard Admin</h1></Link>
                ) : (
              <Link href="/perfil"><h1>Mi Perfil</h1></Link>
              )}
            <button onClick={handleLogout}>
              <Image src={cerrarSesion} alt="cerrar sesion" width={50} height={50} />
            </button>
          </>
          ) : (
          <Link href="/login">
            <Image src={registro} alt="iniciar sesion" width={50} height={50} />
          </Link>
        )}

      </nav>

      {/* Navegación */}
      <nav className={`${style.nav} ${open ? style.showMenu : ""}`}>
        <ul>
          <li>
            <Link href="/" onClick={() => setOpen(false)}>Inicio</Link>
          </li>
          <li>
            <Link href="/acerca" onClick={() => setOpen(false)}>Acerca de</Link>
          </li>
          <li>
            <Link href="/productos" onClick={() => setOpen(false)}>Productos</Link>
          </li>
          <li>
            <Link href="/contacto" onClick={() => setOpen(false)}>Contacto</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

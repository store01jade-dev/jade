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
import { useCart } from "./context/CartContext";

export default function Header() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  // Controla la visibilidad del input de búsqueda en móvil
  const [searchOpen, setSearchOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const router = useRouter();
  const { totalItems } = useCart();

  const handleLogout = () => {
    logout();
    router.push('/login'); // Redirigir al login después del logout
  };

  const handleSearch = () => {
    if (search.trim()) {
      // Redirige a /catalogo con el parámetro 'search' en la URL
      router.push(`/catalogo?search=${encodeURIComponent(search.trim())}`);
    } else {
      // Opcional: Redirigir al catálogo sin búsqueda o mostrar un mensaje
      router.push('/catalogo');
    }
  };

  // Alternar visibilidad del buscador móvil
  const handleMobileSearchToggle = () => {
    setSearchOpen(!searchOpen);
    // Asegurarse de cerrar el menú de navegación si abrimos el buscador
    if (open) setOpen(false); 
  };
  
  // FUNCIÓN DE BÚSQUEDA MODIFICADA para móvil
  const handleSearchAndClose = () => {
    handleSearch(); // Ejecuta la búsqueda
    setSearchOpen(false); // Cierra el buscador móvil después de buscar
  };

  // FUNCIÓN DE KEYDOWN MODIFICADA
  const handleKeyDownAndClose = (e) => {
    if (e.key === 'Enter') {
        handleSearchAndClose(); // Usa la nueva función
    }
  };

  return (
    <header className={style.header}>
      
      {/* 1. Botón Hamburguesa (Izquierda) - OCULTO si la búsqueda móvil está activa */}
      <button 
        className={`${style.menuButton} ${searchOpen ? style.hiddenMobile : ''} ${style.mobileLeft}`} 
        onClick={() => setOpen(!open)} 
        aria-label="Abrir menú" 
      >
        <span className={style.bar}></span>
        <span className={style.bar}></span>
        <span className={style.bar}></span>
      </button>

      {/* 2. Logo (Centro) - Ajustamos la clase log para que solo contenga el logo en móvil */}
      <nav className={`${style.log} ${searchOpen ? style.hiddenMobile : ''}`}> 
        <Link href="/">
          {/* Usamos una clase separada para aplicar el tamaño estándar al logo en móvil */}
          <Image src={logo} alt="logo-Jade" width={60} height={60}  className={style.iconMobile}/>
        </Link>
        {/* Ocultamos el título "Catálogo" en móvil, si no se necesita en el centro */}
        <Link href="/catalogo" className={style.catalogoLink}>
            <h1>Catalogo</h1>
        </Link>
      </nav>
      
      {/* 3. Centro: Buscador (Se mantiene su lógica de visibilidad) */}
      <div className={`${style.search} ${searchOpen ? style.mobileActive : ''}`}> 
        {/* 📌 1. NUEVO BOTÓN DE CERRAR/CANCELAR BÚSQUEDA */}
        {searchOpen && (
            <button
                className={style.closeSearchBtn}
                aria-label="Cerrar búsqueda"
                onClick={handleMobileSearchToggle} // Usa la función de toggle para cerrarlo
            >
                <Image src={cerrarSesion} alt="Cerrar" width={20} height={20} />
            </button>
        )}

        <input type="text" placeholder="Encuentra tu producto" value={search} onChange={(e)=> setSearch(e.target.value)} onKeyDown={handleKeyDownAndClose} />
        <button 
            aria-label="Buscar"
            onClick={handleSearchAndClose} 
        >
            <Image src={buscar} alt="lupa para buscar" width={50} height={50} />
        </button>
      </div>

      {/* 4. Derecha: Acciones (Carrito, Login/Logout, Lupa Móvil) */}
      <nav className={`${style.actions} ${searchOpen ? style.hiddenMobile : ''}`}>
        
        {/* Botón lupa móvil (Lo movemos a .actions para que quede a la derecha) */}
        <button 
          className={`${style.mobileSearchBtn} ${searchOpen ? style.hiddenMobile : ''}`} 
          aria-label="Buscar"
          onClick={handleMobileSearchToggle}
        >
          <Image
              src={buscarLight}
              alt="Buscar"
              width={50}
              height={50}
              className={style.iconMobile}
          />
        </button>
        
        {/* ... (Carrito y Auth se mantienen) ... */}
        {/* Asegúrate de que todos los íconos de Image tengan la clase .iconMobile si quieres controlar el tamaño desde CSS */}
        <div className={style.cartWrapper}>
          <Link href="/carrito">
            <Image src={cart} alt="carrito de compras" width={50} height={50}  className={style.iconMobile} />
          </Link>
          {/* Mostrar la burbuja de notificación si hay ítems */}
          {totalItems > 0 && (
          <span className={style.cartBadge}>{totalItems}</span>
          )}
        </div>

        {isAuthenticated ? (
          < >
           {/* Enlaces Específicos del Rol */}
           {user?.rol === 'admin' ? (
              <Link href="/admin/dashboard"><h1>Admin</h1></Link>
                ) : (
              <Link href="/perfil"><h1>Mi Perfil</h1></Link>
              )}
            <button onClick={handleLogout}>
              <Image src={cerrarSesion} alt="cerrar sesion"  width={50} height={50}  className={style.iconMobile}/>
            </button>
          </>
          ) : (
          <Link href="/login">
            <Image src={registro} alt="iniciar sesion" width={50} height={50}  className={style.iconMobile} />
          </Link>
        )}

      </nav>

      {/* 6. Navegación (Menú) - Usar la clase `open` para mostrar/ocultar */}
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

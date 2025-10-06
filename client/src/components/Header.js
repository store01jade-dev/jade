"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import logo from "../../public/assests/Logo-12.png";
import buscar from "../../public/icons/Search.svg";
import buscarLight from "../../public/icons/SearchLight.svg";
import cart from "../../public/icons/shopingCard.png";
import registro from "../../public/icons/Login.png";
import catalogo from "../../public/icons/inInventoryDark.svg"
import style from "./Header.module.css";


export default function Header() {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

  return (
    <header className={style.header}>
      {/*Izquierda: logo */}
      <div className={style.log}>
        <Image src={logo} alt="logo-Jade" width={100} height={100} />
      </div>

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
        <Link href="/productos">
            <Image src={catalogo} alt="catlogo de productos" width={50} height={50}/>
        </Link>
        <Link href="/carrito">
            <Image src={cart} alt="carrito de compras" width={50} height={50} />
        </Link>
        <Link href="/login">
            <Image src={registro} alt="inicio sesion" width={50} height={50} />
        </Link>
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

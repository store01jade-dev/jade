import Image from "next/image";
import styles from "./Header.module.css";
import menu from "../../public/icons/Menu.png";
import search from "../../public/icons/Search.png";
import logo from "../../public/icons/Frame44.png";
import register from "../../public/icons/Login.png";
import cart from "../../public/icons/shopingCard.png";


export default function Header(){
    return (
        <div className={styles.header}>
            <Image
                src={menu}
                alt="menu"
                width={100}
                height={100}
            />

            <Image
                src={search}
                alt="busqueda"
                width={100}
                height={100}
            />

            <Image
                src={logo}
                alt="logo"
                width={100}
                height={100}
            />

            <Image
                src={register}
                alt="login"
                width={100}
                height={100}
            />

            <Image
                src={cart}
                alt="shopingCart"
                width={100}
                height={100}
            />
        </div>
    )
}
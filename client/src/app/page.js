import Image from "next/image";
import styles from "./page.module.css";
import logo from "../../public/assests/LOGO-02.png";

export default function Home() {
  return (
    <div className={styles.page}>
      <header>
        <h1>Hola soy el header!</h1>
      </header>
      <main className={styles.main}>
        <h1>Hola soy el main!</h1>
        <Image
          aria-hidden
          src={logo}
          alt="logo"
          width={320}
          height={420}
        />
      </main>
      <footer className={styles.footer}>Hola soy el footer</footer>
    </div>
  );
}

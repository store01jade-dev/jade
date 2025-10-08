import Image from "next/image";
import style from "./page.module.css";
import logo from "../../public/assests/LOGO-02.png";

export default function Home() {
  return (
    <div className={style.page}>
      <section className={style.banner}>Banner</section>
      <section className={style.new}>New</section>
      <section className={style.catalogo}>Catalogo</section>
      <section className={style.tendencia}>Tendencia</section>
      <section className={style.coments}>Coments</section>
    </div>
  );
}

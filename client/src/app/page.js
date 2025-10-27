import Image from "next/image";
import style from "./page.module.css";
import logo from "../../public/assests/LOGO-02.png";
import Banner from "@/components/home/Banner";
import NewProducts from "@/components/home/NewProducts";
import FeaturedCatalog from "@/components/home/FeaturedCatalog";
import TrendingProducts from "@/components/home/TrendingProducts";
import CommentsSection from "@/components/home/CommentsSection";

export default function Home() {
  return (
    <div className={style.page}>
      <section className={style.banner}>
        <Banner />
      </section>
      <section className={style.new}>
        <NewProducts />
      </section>
      <section className={style.catalogo}>
        <FeaturedCatalog />
      </section>
      <section className={style.tendencia}>
        <TrendingProducts />
      </section>
      <section className={style.coments}>
        <CommentsSection />
      </section>
    </div>
  );
}

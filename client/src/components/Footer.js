import style from "./Footer.module.css";
import Image from "next/image";
import whatsapp from "../../public/icons/WhatsAppLight.svg";
import facebook from "../../public/icons/FacebookLight.svg";
import instagram from "../../public/icons/Instagramlight.svg";
import ticktock from "../../public/icons/TikTokLight.svg";
import email from "../../public/icons/EmailLight.svg";
//import logo from "../../public/assests/Logo-12.png";

export default function Footer() {
  return (
    <footer className={style.footer}>
        <section className={style.politicas}>
            <a>Terminos y Condiciones</a>
            <a>Politica de Privacidad</a>
            <a>Declaracion de Privacidad</a>
            <a>Politica de Envio</a>
            <a>Politica de Reembolso</a>
        </section>

        <section className={style.informacion}>
            <p>telefono</p>
            <p>Direccion</p>
            <p>Barrio y Ciudad</p>
            <p>Tienda virtual</p>
        </section>

        <section className={style.redes}>
            <Image src={whatsapp} alt="Whastapp" width={50} height={50}/>
            <Image src={facebook} alt="facebook" width={50} height={50}/>
            <Image src={instagram} alt="instagram" width={50} height={50}/>
            <Image src={ticktock} alt="tiktok" width={100} height={50}/>
            <Image src={email} alt="email" width={50} height={50}/>
            {/*<Image src={logo} alt="logo" width={80} height={80}/>*/}
        </section>

        <section className={style.contacto}>
            <form>
                <input type="text" placeholder="Nombre"/>
                <input type="text" placeholder="email"/>
                <textarea rows={5} cols={50}></textarea><br/><br/>
                <button>Enviar</button>
            </form>
        </section>
        <p>© 2025 Jade. Todos los derechos reservados.</p>
    </footer>
  );
}

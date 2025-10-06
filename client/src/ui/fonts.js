import {Bodoni_Moda_SC, Josefin_Sans} from 'next/font/google';

export const bodoni = Bodoni_Moda_SC({
    subsets: ['latin'],
    variable: "--font-title",
    weight: ["400", "700"],
});

export const josefin = Josefin_Sans({
    subsets: ["latin"],
    variable: "--font-text",
    weight: ["400", "600"]
})

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configuración de las imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'http', // Usa 'http' para localhost
        hostname: 'localhost', // El dominio es 'localhost'
        port: '4000', // El puerto de tu servidor Express
        pathname: '/uploads/**', // Permite cualquier ruta dentro de /uploads/
      },
      // Puedes añadir otros dominios externos aquí si los necesitas
    ],
  },
};

export default nextConfig;

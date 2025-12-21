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
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Corregido: punto en lugar de guion
        pathname: '/**', // Permite cualquier ruta de imagen en tu cuenta
      },
      {
        protocol: 'https',
        hostname: 'jade-ewjv.onrender.com',
        pathname: '/**',
      },
    ],

    domains: [
      'res.cloudinary.com', 'jade-ewjv.onrender.com'
    ],
  },
};

export default nextConfig;

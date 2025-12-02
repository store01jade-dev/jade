import ProductDetail from '../../../components/productos/ProductDetail'; 

//Next.js pasa los parámetros de la URL en el objeto 'params'
export default async function ProductDetailPage(props) {
  // params.productoId contendrá el valor dinámico de la URL (ej: '1', '2', etc.)
  const { params } = await Promise.resolve(props);
  const id = params.id;

  //console.log("Intentando cargar producto con ID:", id); // Verifica esto en tu terminal Next.js

  if (!id) {
      return <div>Error: ID de producto no proporcionado.</div>;
  }

  // Renderizamos tu componente ProductDetail, pasándole el ID
  return (
    <div className="py-8">
        {/* Pasamos el ID del producto como prop */} 
        <ProductDetail productoId={id} />
    </div>
  );
}

// app/productos/[id]/page.js

//import ProductDetail from '../../../components/productos/ProductDetail'; 

/* Función para obtener los datos del producto
async function getProductData(id) {
    // 📌 URL de tu API de Express/Backend
    const API_URL = 'http://localhost:4000/api/v1/productos'; 
    
    try {
        const res = await fetch(`${API_URL}/${id}`, { 
            // 🚨 CRÍTICO: Añadir no-store o revalidate: 0 para asegurar datos frescos durante el desarrollo
            cache: 'no-store' 
        });

        if (!res.ok) {
            console.error(`Error al obtener producto ${id}: ${res.status}`);
            return null; // Devuelve null si no se encuentra o hay error
        }
        
        return res.json();
    } catch (error) {
        console.error("Fallo la conexión con el backend:", error);
        return null;
    }
}

export default async function ProductDetailPage({ params }) {
  const id = params.id;

  if (!id) {
      return <div>Error: ID de producto no proporcionado.</div>;
  }
  
  // 📌 CRÍTICO: Obtenemos los datos del producto AQUI, antes de renderizar
  const producto = await getProductData(id);

  // 📌 MANEJO DE ERROR Y CARGA
  if (!producto) {
      // Si producto es null (por error 404 o fetch fallido)
      return (
        <div className="py-8 text-center">
            <h1>Producto no encontrado</h1>
            <p>El ID '{id}' no corresponde a ningún producto existente.</p>
        </div>
      );
  }

  // 📌 CRÍTICO: Pasamos el objeto 'producto' completo al componente hijo
  return (
    <div className="py-8">
        <ProductDetail producto={producto} /> 
    </div>
  );
}*/
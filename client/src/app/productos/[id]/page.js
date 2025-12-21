import ProductDetail from '../../../components/productos/ProductDetail'; 

//Next.js pasa los parámetros de la URL en el objeto 'params'
export default async function ProductDetailPage(params) {
  // params.productoId contendrá el valor dinámico de la URL (ej: '1', '2', etc.)
  const resolvedParams = await params;
  const id = resolvedParams.id;

  //console.log("Intentando cargar producto con ID:", id); // Verifica esto en tu terminal Next.js

  if (!id) {
      return <div>Error: ID de producto no proporcionado en la URL.</div>;
  }

  // Renderizamos tu componente ProductDetail, pasándole el ID
  return (
    <div className="py-8">
        {/* Pasamos el ID del producto como prop */} 
        <ProductDetail productoId={id} />
    </div>
  );
}


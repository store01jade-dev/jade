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


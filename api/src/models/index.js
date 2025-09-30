// src/models/index.js
// Archivo central que carga todos los modelos y declara sus asociaciones.
// Usa ESM (import / export). Ajusta las rutas si tu estructura es distinta.

import sequelize from "../config/db.js"; // instancia Sequelize creada en src/config/db.js

// Importar modelos (se asume que cada archivo hace: export default Modelo)
import Usuario from "./userModel.js";
import Categoria from "./Categoria.js";
import Producto from "./Producto.js";
import VarianteProducto from "./VarianteProducto.js";
import ProductoImagen from "./ProductoImagen.js";
import Direccion from "./Direccion.js";
import Pedido from "./Pedido.js";
import DetallePedido from "./DetallePedido.js";
import Pago from "./Pago.js";

/* ===========================
   Definición de asociaciones
   ===========================
   Aquí declaramos todas las relaciones entre los modelos en un solo lugar.
   - Esto evita imports circulares dentro de los modelos individuales.
   - Las claves foreignKey deben coincidir con los nombres que usaste en los modelos.
*/

// Usuario <-> Direccion
// Un usuario puede tener muchas direcciones; una dirección pertenece a un usuario.
Usuario.hasMany(Direccion, { foreignKey: "usuario_id", as: "direcciones" });
Direccion.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });

// Categoria <-> Producto
// Una categoría tiene muchos productos; un producto pertenece a una categoría.
Categoria.hasMany(Producto, { foreignKey: "categoria_id", as: "productos" });
Producto.belongsTo(Categoria, { foreignKey: "categoria_id", as: "categoria" });

// Producto <-> VarianteProducto
// Un producto tiene muchas variantes; una variante pertenece a un producto.
// Nótese que el campo en el modelo VarianteProducto se nombró "product_id" según tu diagrama.
Producto.hasMany(VarianteProducto, { foreignKey: "producto_id", as: "variantes" });
VarianteProducto.belongsTo(Producto, { foreignKey: "producto_id", as: "producto" });

// Producto <-> ProductoImagen
// Un producto puede tener muchas imágenes (imágenes generales del producto).
Producto.hasMany(ProductoImagen, { foreignKey: "producto_id", as: "imagenesProducto" });
ProductoImagen.belongsTo(Producto, { foreignKey: "producto_id", as: "producto" });

// VarianteProducto <-> ProductoImagen
// Una variante puede tener muchas imágenes (imágenes específicas de variante).
VarianteProducto.hasMany(ProductoImagen, { foreignKey: "varianteId", as: "imagenesVariante" });
ProductoImagen.belongsTo(VarianteProducto, { foreignKey: "varianteId", as: "variante" });

// Usuario <-> Pedido
// Un usuario puede tener muchos pedidos; un pedido pertenece a un usuario.
Usuario.hasMany(Pedido, { foreignKey: "usuario_id", as: "pedidos" });
Pedido.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });

// Direccion <-> Pedido
// Una dirección puede estar asociada a muchos pedidos; un pedido usa una dirección.
Direccion.hasMany(Pedido, { foreignKey: "direccion_id", as: "pedidos" });
Pedido.belongsTo(Direccion, { foreignKey: "direccion_id", as: "direccion" });

// Pedido <-> Pago
// Un pedido puede tener (o estar relacionado con) un pago.
// Aquí asumimos que Pago tiene campo pedido_id (Pago.belongsTo(Pedido)) y que
// Pedido puede tener un Pago vía pedido_id.
Pedido.hasOne(Pago, { foreignKey: "pedido_id", as: "pago" });
Pago.belongsTo(Pedido, { foreignKey: "pedido_id", as: "pedido" });

// Pedido <-> DetallePedido
// Un pedido tiene muchos detalles (líneas); un detalle pertenece a un pedido.
Pedido.hasMany(DetallePedido, { foreignKey: "pedido_id", as: "detalles" });
DetallePedido.belongsTo(Pedido, { foreignKey: "pedido_id", as: "pedido" });

// VarianteProducto <-> DetallePedido
// Una variante puede aparecer en muchos detalles de pedido; el detalle apunta a la variante.
VarianteProducto.hasMany(DetallePedido, { foreignKey: "variantes_producto_id", as: "detalles" });
DetallePedido.belongsTo(VarianteProducto, { foreignKey: "variantes_producto_id", as: "variante" });

/* ===========================
   Exportar modelos + conexión
   ===========================
   - export default db para importarlo fácilmente.
   - export named por conveniencia si prefieres destructuring.
*/
const db = {
  sequelize, // instancia
  // modelos
  Usuario,
  Categoria,
  Producto,
  VarianteProducto,
  ProductoImagen,
  Direccion,
  Pedido,
  DetallePedido,
  Pago,
};

// helper para sincronizar (solo en desarrollo)
export const syncAll = (options = { alter: true }) => {
  // Nota: en producción, usa migraciones en lugar de sync().
  return sequelize.sync(options);
};

export default db;
export {
  Usuario,
  Categoria,
  Producto,
  VarianteProducto,
  ProductoImagen,
  Direccion,
  Pedido,
  DetallePedido,
  Pago,
  sequelize,
};


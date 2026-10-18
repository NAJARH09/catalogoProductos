
import type { Product } from "../../interface/product.interface";
import { Link } from "react-router-dom";

// Importamos la función que unifica los nombres de las categorías.
// Ejemplo: "FILTRO DE AIRE" y "FILTRO AIRE" se muestran como "AIRE".
import { normalizarCategoria } from "../../utils/Categorias";

// Definimos las propiedades que recibe el componente.
// ProductCard recibe un único producto de tipo Product.
interface ProductCardProps {
  product: Product;
}

// Componente que representa una tarjeta individual del catálogo.
export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    // Link permite abrir el detalle del producto al hacer clic en la tarjeta.
    // Utilizamos el ID de Supabase para identificar el producto.
    <Link
      to={`/producto/${product.idproducto}`}
      className="producto-link"
      aria-label={`Ver detalles del producto ${product.codigoKusa}`}
    >
      <article className="producto-card">

        {/* CONTENEDOR DE IMAGEN */}

        <div className="producto-imagen-contenedor">

          {/* Si el producto tiene una URL de imagen, mostramos la fotografía. */}
          {product.imagenUrl ? (
            <img
              className="producto-imagen"
              src={product.imagenUrl}
              alt={`Filtro KUSA ${product.codigoKusa}`}
              loading="lazy"
            />
          ) : (
            // Si no tiene imagen, mostramos un contenido alternativo.
            <div className="producto-sin-imagen">
              <span>KUSA</span>
              <small>Imagen no disponible</small>
            </div>
          )}

          {/* Etiqueta de marca que se muestra sobre la imagen. */}
          <span className="producto-etiqueta">KUSA</span>
        </div>

        {/* INFORMACIÓN DEL PRODUCTO */}

        <div className="producto-informacion">

          {/* Normalizamos la categoría para evitar nombres diferentes
              para un mismo tipo de filtro. */}
          <p className="producto-categoria">
            {normalizarCategoria(product.Categoria)}
          </p>

          {/* Mostramos el código KUSA del producto. */}
          <h3 className="producto-codigo">
            {product.codigoKusa}
          </h3>

          {/* PARTE INFERIOR DE LA TARJETA */}

          <div className="producto-pie">

            {/* Mostramos la presentación registrada en Supabase.
                Si no existe, indicamos que debe consultarse. */}
            <p className="producto-presentacion">
              {product.presentacion || "Consultar presentación"}
            </p>

            {/* Flecha decorativa que indica que se puede abrir el detalle.
                aria-hidden evita que los lectores de pantalla la anuncien. */}
            <span className="producto-flecha" aria-hidden="true">
              ↗
            </span>

          </div>
        </div>
      </article>
    </Link>
  );
};

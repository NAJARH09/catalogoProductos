
import type { Product } from "../../interface";
import { ProductCard } from "./ProductoCard";

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <section className="productos-grid">
      {products.map((product) => (
        <ProductCard
          key={product.idproducto}
          product={product}
        />
      ))}
    </section>
  );
};
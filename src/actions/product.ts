import { supabase } from "../supabase/client";
import type { Product } from "../interface/index";

export const getProducts = async (): Promise<Product[]> => {

  const { data, error } = await supabase
    .from("Producto")
    .select("*");

  if (error) {
    console.error("Error obteniendo productos:", error);
    throw error;
  }

  return data;
};



export const getProductsByCategory = async (
  categoria: string
): Promise<Product[]> => {

  const { data, error } = await supabase
    .from("Producto")
    .select("*")
    .eq("Categoria", categoria);

  if (error) {
    console.error("Error filtrando productos:", error);
    throw error;
  }

  return data;
};


// Obtener la descripción larga de un producto
export const getDescripcionProducto = async (idproducto: number) => {
  const { data, error } = await supabase
    .from("descripcion_producto")
    .select("descripcion_larga")
    .eq("producto_id", idproducto)
    .maybeSingle();

  if (error) {
    console.error("Error obteniendo descripción:", error);
    throw error;
  }

  return data;
};

// Obtener las medidas de un producto
export const getMedidasProducto = async (idproducto: number) => {
  const { data, error } = await supabase
    .from("detalle_medidas")
    .select("altura, largo, ancho, especificaciones")
    .eq("product_id", idproducto)
    .maybeSingle();

  if (error) {
    console.error("Error obteniendo medidas:", error);
    throw error;
  }

  return data;
};

// Obtener equivalencias de un producto
export const getEquivalenciasProducto = async (idproducto: number) => {
  const { data, error } = await supabase
    .from("Equivalente")
    .select("idEquivalencia, marcaEquivalente, codigoEquivalente")
    .eq("producto_id", idproducto);

  if (error) {
    console.error("Error obteniendo equivalencias:", error);
    throw error;
  }

  return data ?? [];
};


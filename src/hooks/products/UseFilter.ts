
import { useQuery } from "@tanstack/react-query";
import { getProductsByCategory } from "../../actions/product";



export const useProductsByCategory = (categoria: string) => {
  return useQuery({
    queryKey: ["products", categoria],
    queryFn: () => getProductsByCategory(categoria),
    enabled: categoria !== "Todas",
    staleTime: 1000 * 60 * 5,
  });
};
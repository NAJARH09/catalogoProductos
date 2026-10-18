
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../actions/product";

export const useProduct = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5,
  });

  return {
    products: data ?? [],
    isLoading,
    error,
  };
};
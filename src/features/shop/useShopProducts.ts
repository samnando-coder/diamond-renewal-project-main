import { useQuery } from "@tanstack/react-query";
import { fetchShopProducts } from "./api";

export function useShopProducts() {
  return useQuery({
    queryKey: ["shop-products"],
    queryFn: fetchShopProducts,
    staleTime: 1000 * 60 * 5,
  });
}


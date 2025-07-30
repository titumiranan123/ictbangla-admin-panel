import { useQuery } from "@tanstack/react-query";
import { fetchCoupon } from "./query-functions/fetchCoupon";

export const useCouponList = (query?: any) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["couponlist", query],
    queryFn: () => fetchCoupon(query),
  });

  return { data, isLoading, refetch };
};

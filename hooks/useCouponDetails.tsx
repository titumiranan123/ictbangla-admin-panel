import { useQuery } from "@tanstack/react-query";
import { api_url } from "./apiurl";

export const useCouponDetails = (id: string) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await api_url.get(`/v1/admin-user/coupon-details/${id}`);
      return response.data;
    },
  });
  return { data, isLoading, isError, error, refetch };
};

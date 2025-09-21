import { useQuery } from "@tanstack/react-query";
import { api_url } from "./apiurl";

type CouponParams = {
  page?: number;
  perPage?: number;
  orderBy?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
};

export const useCouponDetails = (
  id: string,
  {
    page = 1,
    perPage = 10,
    orderBy = "FROM_OLD",
    userId,
    startDate,
    endDate,
  }: CouponParams
) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [
      "couponDetails",
      id,
      page,
      perPage,
      orderBy,
      userId,
      startDate,
      endDate,
    ],
    queryFn: async () => {
      const response = await api_url.get(
        `/v1/admin-user/coupon-details/${id}`,
        {
          params: {
            page,
            perPage,
            orderBy,
            startDate,
            endDate,
          },
        }
      );
      return response.data;
    },
    enabled: !!id,
  });

  return { data, isLoading, isError, error, refetch };
};

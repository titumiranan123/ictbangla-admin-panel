import { useQuery } from "@tanstack/react-query";
import { api_url } from "./apiurl";

interface OrderFilters {
  page?: number;
  perPage?: number;
  orderBy?: "FROM_OLD" | "FROM_NEW";
  paymentStatus?: "PAID" | "UNPAID" | "PARTIALLY_PAID" | "";
  courseStatus?: "UPCOMING" | "ONGOING" | "COMPLETED" | "";
  paymentMethod?: string;
  search?: string;
  courseId?:string
}

export const useAllOrders = (filters: OrderFilters = {}) => {
  const {
    page = 1,
    perPage = 10,
    orderBy = "FROM_OLD",
    paymentStatus = "",
    courseStatus = "",
    paymentMethod = "",
    search = "",
    courseId=''
  } = filters;

  const queryKey = ["allOrders", filters];

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      
      params.append("page", page.toString());
      params.append("perPage", perPage.toString());
      params.append("orderBy", orderBy);
      
      if (paymentStatus) params.append("paymentStatus", paymentStatus);
      if (courseStatus) params.append("courseStatus", courseStatus);
      if (paymentMethod) params.append("paymentMethod", paymentMethod);
      if (search) params.append("searchText", search);
      if (courseId) params.append("courseId", courseId);

      const response = await api_url.get(`/v1/admin-user/purchase-list?${params.toString()}`);
      return response.data;
    },
  });

  return { data, isLoading, isError, error, refetch };
};
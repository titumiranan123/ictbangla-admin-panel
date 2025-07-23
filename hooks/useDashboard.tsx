import { useQuery } from "@tanstack/react-query";
import { api_url } from "./apiurl";

export const useDashboard = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await api_url.get(`/v1/admin-user/get/admin-dashboard-overview`);
      return response.data;
    },
  });
  return { data, isLoading, isError, error, refetch }
};

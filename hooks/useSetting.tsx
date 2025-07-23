import { useQuery } from "@tanstack/react-query";
import { api_url } from "./apiurl";

export const useSetting = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await api_url.get(`/v1/website/get/settings-data`);
      return response.data;
    },
  });
  return { data, isLoading, isError, error, refetch }
};

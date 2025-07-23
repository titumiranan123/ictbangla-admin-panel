import { useQuery } from "@tanstack/react-query";
import { api_url } from "./apiurl";

export const useUserProfile = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["UserProfile"],
    queryFn: async () => {
      const response = await api_url.get(`/v1/user/get/user-profile`);
      return response.data;
    },
  });
  return { data, isLoading, isError, error, refetch }
};

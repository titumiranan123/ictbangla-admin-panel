import { useQuery } from "@tanstack/react-query";
import { api_url } from "./apiurl";


const useCategory = () => {
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const response = await api_url.get(
        "/v1/admin-user/course-category-list"
      );
      return response.data;
    },
  });
  return { data, error, isLoading, isError, refetch };
};

export default useCategory;

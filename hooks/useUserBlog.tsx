import { useQuery } from "@tanstack/react-query";
import { api_url } from "./apiurl";


const useUserBlog = () => {
  const { data, isError, isLoading,refetch } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      try {
        const res = await api_url.get("/v1/user/get/blog-list");
        return res.data;
      } catch (error) {
        console.error("Error fetching section list:", error)
      }
    }
  });

  return { data, isError, isLoading,refetch };
};

export default useUserBlog;
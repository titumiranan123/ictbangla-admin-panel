import { useQuery } from "@tanstack/react-query";
import { api_url } from "./apiurl";

interface FilterParams {
  page?: number;
  perPage?: number;
  userRole?: string;
  search?: string;
}

export const useAllUserList = (
  filters: FilterParams = { page: 1, perPage: 10, userRole: "", search: "" }
) => {
  const { page = 1, perPage = 10, userRole = "", search = "" } = filters;

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["all-users", page, perPage, userRole, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("perpage", perPage.toString());
      if (search) params.append("searchText", search);
      if (userRole) params.append("userRole", userRole); // Correct key

      const res = await api_url.get(
        `/v1/admin-user/get-users/list?${params.toString()}`
      );
      return res.data;
    },
    staleTime: 1000 * 60,
  });

  return {
    data,
    isLoading,
    refetch,
    isError,
    error,
  };
};

import { useQuery } from "@tanstack/react-query";
import { api_url } from "./apiurl";

interface FilterOptions {
  orderBy?: "FROM_OLD" | "FROM_NEW";
  searchText?: string;
  page?: number;
  perPage?: number;
}

export const useLeadNumber = (filters: FilterOptions = {}) => {
  return useQuery({
    queryKey: ["number", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (!filters.orderBy) {
        params.append("orderBy", "FROM_NEW");
      }

      if (filters.searchText) {
        params.append("searchText", filters.searchText);
      }

      if (filters.page) {
        params.append("page", filters.page.toString());
      }

      if (filters.perPage) {
        params.append("perPage", filters.perPage.toString());
      }

      const response = await api_url.get(
        `/v1/admin-user/get-numbers-on-course?${params.toString()}`
      );
      return response.data;
    },
  });
};

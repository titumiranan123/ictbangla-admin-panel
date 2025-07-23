import { useQuery } from "@tanstack/react-query"
import { api_url } from "./apiurl"


interface FilterOptions {
  is_active?: boolean;
  orderBy?: 'FROM_OLD' | 'FROM_NEW';
  searchText?: string;
}

export const useAllAgent = (filters: FilterOptions = {}) => {
  return useQuery({
    queryKey: ['agents', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.is_active !== undefined) {
        params.append('is_active', filters.is_active.toString());
      }
      
      if (filters.orderBy) {
        params.append('orderBy', filters.orderBy);
      }
      
      if (filters.searchText) {
        params.append('searchText', filters.searchText);
      }

      const response = await api_url.get(`/v1/admin-user/call-agents?${params.toString()}`);
      return response.data;
    },
  });
};

import { useQuery } from "@tanstack/react-query";
import { api_url } from "./apiurl";
interface filters {
  page:number,
  perPage:number,
  orderBy:string
  searchText:string
  basicStatus : string
  status:string
}
const useCourseList = (filters:filters = {
  page: 1,
  perPage: 10,
  orderBy: "",
  searchText: "",
  basicStatus: "",
  status: ""
}) => {
  const {page=1,perPage=10,orderBy="",searchText="",basicStatus="",status=""} = filters
  const { data, isLoading, refetch ,isError} = useQuery({
    queryKey: ["course"],
    queryFn: async () => {
      const params = new URLSearchParams()
      
      params.append("page",page.toString())
      params.append("perPage",perPage.toString())
      params.append("orderBy",orderBy.toString())
      params.append("searchText",searchText.toString())
      params.append("basicStatus",basicStatus.toString())
      params.append("status",status.toString())
      const res = await api_url.get(
        `/v1/admin-user/get-course-list?${params.toString()}`
      );
      return res.data;
    },
  });
  return { data, isLoading, refetch,isError };
};

export default useCourseList;

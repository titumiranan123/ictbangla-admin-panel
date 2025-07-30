import { api_url } from "../apiurl";
interface fetchCouponParams {
  page?: number;
  perPage?: number;
  searchText?: string;
  orderBy?: "FROM_OLD" | "FROM_NEW";
  course_id?: string;
}
const defaultParams: fetchCouponParams = {
  page: 1,
  perPage: 10,
  searchText: "",
  orderBy: "FROM_NEW",
  course_id: undefined,
};
export const fetchCoupon = async (params: Partial<fetchCouponParams>) => {
  const meargeParams = { ...defaultParams, ...params };
  const queryParams = new URLSearchParams();
  const finalPage = meargeParams.page ?? 1;
  const finalPerpage = meargeParams.perPage ?? 10;
  queryParams.append("page", finalPage?.toString());
  queryParams.append("perPage", finalPerpage?.toString());
  queryParams.append("orderBy", meargeParams.orderBy ?? "FROM_NEW");
  if (meargeParams.searchText) {
    queryParams.append("searchText", meargeParams.searchText);
  }
  if (meargeParams.course_id) {
    queryParams.append("course_id", meargeParams.course_id);
  }

  const res = await api_url.get(
    `/v1/admin-user/get/coupon-list?${queryParams.toString()}`
  );

  return res.data;
};

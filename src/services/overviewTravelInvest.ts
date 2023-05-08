import { axios, isArray } from "@/utils";
// 旅游投资规模 -分页查询
export const getPageList = (query: any) => {
  return axios.get("/v1.0/travelInvest/page", query);
};
// 旅游投资规模 -删除
export const deleteResource = (ids: any) => {
  return axios.delete("/v1.0/travelInvest/batchDelete", {
    ids: isArray(ids) ? ids : [ids],
  });
};
// 旅游投资规模 -新增
export const addResource = (query: any) => {
  return axios.post("/v1.0/travelInvest", query);
};
// 旅游投资规模 -更新
export const updateResource = (query: any) => {
  return axios.put("/v1.0/travelInvest", query);
};
// 旅游投资规模 -详情
export const getResourceDetail = (id: string) => {
  return axios.get(`/v1.0/travelInvest/${id}`);
};

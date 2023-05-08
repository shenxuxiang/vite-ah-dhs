import { axios, isArray } from "@/utils";
// 出行方式占比 -分页查询
export const getPageList = (query: any) => {
  return axios.get("/v1.0/travelWay/page", query);
};
// 出行方式占比 -删除
export const deleteResource = (ids: any) => {
  return axios.delete("/v1.0/travelWay/batchDelete", {
    ids: isArray(ids) ? ids : [ids],
  });
};
// 出行方式占比 -新增
export const addResource = (query: any) => {
  return axios.post("/v1.0/travelWay", query);
};
// 出行方式占比 -更新
export const updateResource = (query: any) => {
  return axios.put("/v1.0/travelWay", query);
};
// 出行方式占比 -详情
export const getResourceDetail = (id: string) => {
  return axios.get(`/v1.0/travelWay/${id}`);
};

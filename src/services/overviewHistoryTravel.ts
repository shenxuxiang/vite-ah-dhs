import { axios, isArray } from "@/utils";
// 历年旅游指数 -分页查询
export const getPageList = (query: any) => {
  return axios.get("/v1.0/historyTravelIndex/page", query);
};
// 历年旅游指数 -删除
export const deleteResource = (ids: any) => {
  return axios.delete("/v1.0/historyTravelIndex/batchDelete", {
    ids: isArray(ids) ? ids : [ids],
  });
};
// 历年旅游指数 -新增
export const addResource = (query: any) => {
  return axios.post("/v1.0/historyTravelIndex", query);
};
// 历年旅游指数 -更新
export const updateResource = (query: any) => {
  return axios.put("/v1.0/historyTravelIndex", query);
};
// 历年旅游指数 -详情
export const getResourceDetail = (id: string) => {
  return axios.get(`/v1.0/historyTravelIndex/${id}`);
};

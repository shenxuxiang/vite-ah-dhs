import { axios, isArray } from "@/utils";
// 枢纽数量 -分页查询
export const getPageList = (query: any) => {
  return axios.get("/v1.0/hingeNum/page", query);
};
// 枢纽数量 -删除
export const deleteResource = (ids: any) => {
  return axios.delete("/v1.0/hingeNum/batchDelete", {
    ids: isArray(ids) ? ids : [ids],
  });
};
// 枢纽数量 -新增
export const addResource = (query: any) => {
  return axios.post("/v1.0/hingeNum", query);
};
// 枢纽数量 -更新
export const updateResource = (query: any) => {
  return axios.put("/v1.0/hingeNum", query);
};
// 枢纽数量 -详情
export const getResourceDetail = (id: string) => {
  return axios.get(`/v1.0/hingeNum/${id}`);
};

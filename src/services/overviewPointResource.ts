import { axios, isArray } from "@/utils";
// 景区资源统计 -分页查询
export const getPageList = (query: any) => {
  return axios.get("/v1.0/sightResourceStatistics/page", query);
};
// 景区资源统计 -删除
export const deleteResource = (ids: any) => {
  return axios.delete("/v1.0/sightResourceStatistics/batchDelete", {
    ids: isArray(ids) ? ids : [ids],
  });
};
// 景区资源统计 -新增
export const addResource = (query: any) => {
  return axios.post("/v1.0/sightResourceStatistics", query);
};
// 景区资源统计 -更新
export const updateResource = (query: any) => {
  return axios.put("/v1.0/sightResourceStatistics", query);
};
// 景区资源统计 -详情
export const getResourceDetail = (id: string) => {
  return axios.get(`/v1.0/sightResourceStatistics/${id}`);
};

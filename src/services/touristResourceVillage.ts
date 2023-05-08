import axios from "@/utils/axios";

export const getRegionList = () => {
  return axios.get("/v1.0/chinaProvince/region");
};

// 潜力村庄 -分页查询
export const getPageList = (query: any) => {
  return axios.get("/v1.0/potentialVillage/page", query);
};
// 潜力村庄 -删除
export const deleteResource = (id: any) => {
  return axios.delete(`/v1.0/potentialVillage/${id}`);
};
// 潜力村庄 -新增
export const addResource = (query: any) => {
  return axios.post("/v1.0/potentialVillage", query);
};
// 潜力村庄 -详情
export const getResourceDetail = (id: string) => {
  return axios.get(`/v1.0/potentialVillage/${id}`);
};
// 潜力村庄 -更新
export const updateResource = (query: any) => {
  return axios.put("/v1.0/potentialVillage", query);
};
// 潜力村庄 -提交审批
export const commitApprove = (query: any) => {
  return axios.post("/v1.0/potentialVillage/commitApprove", query);
};
// 潜力村庄 -提交审批
export const approve = (query: any) => {
  return axios.post("/v1.0/potentialVillage/approve", query);
};

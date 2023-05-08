import axios from "@/utils/axios";

export const getRegionList = () => {
  return axios.get("/v1.0/chinaProvince/region");
};

// 其他资源 -分页查询
export const getPageList = (query: any) => {
  return axios.get("/v1.0/otherResource/page", query);
};
// 其他资源 -删除
export const deleteResource = (id: any) => {
  return axios.delete(`/v1.0/otherResource/${id}`);
};
// 其他资源 -新增
export const addResource = (query: any) => {
  return axios.post("/v1.0/otherResource", query);
};
// 其他资源 -详情
export const getResourceDetail = (id: string) => {
  return axios.get(`/v1.0/otherResource/${id}`);
};
// 其他资源 -更新
export const updateResource = (query: any) => {
  return axios.put("/v1.0/otherResource", query);
};

// 其他资源 -具体类型
export const getDetailType = () => {
  return axios.get("/v1.0/otherResource/detailType");
};
// 潜力村庄 -提交审批
export const commitApprove = (query: any) => {
  return axios.post("/v1.0/otherResource/commitApprove", query);
};
// 潜力村庄 -提交审批
export const approve = (query: any) => {
  return axios.post("/v1.0/otherResource/approve", query);
};

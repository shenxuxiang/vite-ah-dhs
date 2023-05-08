import axios from "@/utils/axios";

// 登录
export const signIn = (query: any) => {
  return axios.post("/v1.0/login/admin", query);
};
// 退出
export const signOut = () => {
  return axios.post("/v1.0/logout");
};
// 修改密码
export const updateUserPasswd = (query: any) => {
  return axios.post("/v1.0/sysUser/changePassword", query);
};

// 未处理列表
export const getUnDealTaskList = () => {
  return axios.get("/v1.0/sysNotice/unDellist");
};

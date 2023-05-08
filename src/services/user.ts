import { axios, isArray, isEmpty } from "@/utils";

// 用户
export const getUserList = (query: any) => {
  return axios.get("/v1.0/sysUser/page", query);
};
// 获取用户详情
export const getUserDetail = (id: string) => {
  return axios.get("/v1.0/sysUser/" + id);
};
// 修改用户详情
export const updateUserDetail = (query: any) => {
  return axios.put("/v1.0/sysUser", query);
};
// 新增用户
export const addUser = (query: any) => {
  return axios.post("/v1.0/sysUser", query);
};
// 删除用户
export const deleteUser = (ids: any) => {
  return axios.delete(`/v1.0/sysUser/batchDelete`, {
    ids: isArray(ids) ? ids : [ids],
  });
};

// 重置用户密码
// export const resetUserPassword = (query: any) => {
//   return axios.post('/v1.0/sysUser/resetPassword', query);
// };

// 角色列表
export const getRolePageList = (query: any) => {
  if (isEmpty(query.order)) {
    return axios.get("/v1.0/sysRole/page", query);
  } else {
    const params = { ...query };
    const order = JSON.stringify(params.order);
    params.order = order;
    return axios.get("/v1.0/sysRole/page", params);
  }
};
// 角色列表-不分页
export const getRoleList = () => {
  return axios.get("/v1.0/sysRole/list");
};

// 获取角色详情
export const getRoleDetail = (id: string) => {
  return axios.get("/v1.0/sysRole/" + id);
};
// 修改角色详情
export const updateRoleDetail = (query: any) => {
  return axios.put("/v1.0/sysRole", query);
};
// 新增角色
export const addRole = (query: any) => {
  return axios.post("/v1.0/sysRole", query);
};
// 删除角色
export const deleteRole = (ids: any) => {
  return axios.delete(`/v1.0/sysRole/delete`, {
    ids: isArray(ids) ? ids : [ids],
  });
};

// 获取角色菜单详情
export const getRoleMenuResource = (id: string) => {
  return axios.post("/v1.0/sysRole/resource/" + id);
};

// 获取菜单资源树
export const getMenuSourceTree = () => {
  return axios.get("/v1.0/sysResource/tree");
};

export const getRegionList = (query?: any) => {
  return axios.get("/v1.0/chinaProvince/region", query);
};

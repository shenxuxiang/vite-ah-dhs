import axios from "@/utils/axios";

export const getPageList = (query: any) => {
  return axios.get("/v1.0/sysOperateLog/page", query);
};

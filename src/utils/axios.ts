import { message } from "antd";
import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { getLocalStorage } from "@/utils";

let controller = new AbortController();

// 取消请求
export const abortRequestEffect = () => {
  controller.abort();
  controller = new AbortController();
};

type RequestParams = {
  [key: string]: any;
};

// 请求响应参数，包含data
type ResultData<T = {}> = T;
// 接口超时定义
const TIMEOUT = 200000;
// 接口相应成功后的 code 定义
enum ResponseCode {
  SUCCESS_CODE = 0,
  OVERDUE_CODE = 401,
}

const defaultConfig: AxiosRequestConfig = {
  baseURL: "",
  timeout: TIMEOUT,
  // 跨域是否允许携带 cookie
  withCredentials: true,
};

class RequestHttp {
  public request: AxiosInstance;
  constructor(options?: AxiosRequestConfig) {
    const config = { ...defaultConfig, ...options };
    // 实例化 axios
    this.request = axios.create(config);

    // 请求拦截器
    this.request.interceptors.request.use(
      (config: any) => {
        const token = getLocalStorage("TOKEN") || "Bearer Token";
        return {
          ...config,
          signal: controller.signal,
          headers: { Authorization: token },
        };
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // 响应拦截器
    this.request.interceptors.response.use(
      (response: AxiosResponse) => {
        const {
          data,
          data: { code, message: msg },
          request: { responseType },
          headers,
        } = response;

        // 下载文件，blob 直接用于文件的下载
        if (responseType === "blob") {
          let fileName = headers["content-disposition"] ?? "";

          const matched = /^attachment;\s*filename\*?=(?:utf-8'')?([^,]+)/.exec(
            fileName
          );
          if (matched === null) {
            fileName = "defaultName";
          } else {
            fileName = decodeURIComponent(matched[1]);
          }

          return { data, fileName };
        }

        // 登录凭证失效/过期
        if (code === ResponseCode.OVERDUE_CODE) {
          message.error("登录已过期，请重新登录");
          window.localStorage.clear();
          abortRequestEffect();
          this.redirectToLogin();
          return Promise.reject(data);
        }

        // 接口异常
        if (typeof code !== "undefined" && code !== ResponseCode.SUCCESS_CODE) {
          msg && message.error(msg);
          return Promise.reject(data);
        }

        return data;
      },
      (error: AxiosError) => {
        const { response } = error;
        if (response) {
          this.handleCheckStatus(response.status);
        }
        if (!window.navigator.onLine) {
          message.error("网络连接失败");
        }
      }
    );
  }

  // 校验状态码
  handleCheckStatus(status: number): void {
    switch (status) {
      case 401:
        abortRequestEffect();
        message.error("登录已过期，请重新登录");
        window.localStorage.clear();
        setTimeout(() => this.redirectToLogin(), 1500);
        break;
      default:
        message.error("请求失败");
        break;
    }
  }

  // 重定向到登录页
  redirectToLogin() {
    if (window.location.hash.startsWith("#/login")) return;
    let href = window.location.hash.slice(1);
    href = window.encodeURIComponent(href);
    window.location.assign(`/#/login?redirect=${href}`);
  }

  get<T>(url: string, params?: RequestParams): Promise<ResultData<T>> {
    return this.request.get(url, { params });
  }

  getBlob<T>(url: string, params?: RequestParams): Promise<ResultData<T>> {
    return this.request.get(url, { params, responseType: "blob" });
  }

  delete<T>(url: string, params?: RequestParams): Promise<ResultData<T>> {
    return this.request.delete(url, { data: params });
  }

  post<T>(
    url: string,
    params?: RequestParams,
    config?: AxiosRequestConfig
  ): Promise<ResultData<T>> {
    return this.request.post(url, params, config);
  }

  put<T>(
    url: string,
    params?: RequestParams,
    config?: AxiosRequestConfig
  ): Promise<ResultData<T>> {
    return this.request.put(url, params, config);
  }
}

export default new RequestHttp();

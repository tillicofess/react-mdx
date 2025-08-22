import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError
} from "axios";
import { refreshAccessToken, isRefreshRequest, isGetUserInfoRequest } from "@/apis/casdoor";
import { getApiConfig, isDevelopment } from "../config/env";
import { reportError } from "@/utils/errorReporter";
import { toast } from 'sonner'

// 获取当前环境的 API 配置
const apiConfig = getApiConfig();

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  withCredentials: apiConfig.withCredentials,
  headers: {
    "Content-Type": "application/json",
  },
});

function shouldReport(error: AxiosError): boolean {
  if (error.config?.url?.includes('/api/logs')) return false;

  const status = error.response?.status;
  const infraCodes = [520, 521, 522, 523, 524, 525, 526];
  const skipCodes = [401, 403];

  if (error.code === 'ERR_CANCELED') return false;
  if (!error.response) return navigator.onLine; // 离线不上报

  if (status && infraCodes.includes(status)) return false;
  if (status && skipCodes.includes(status)) return false;

  return true;
}

// 请求拦截器
instance.interceptors.request.use(
  async (config) => {
    // 在发送请求之前做些什么
    if (isDevelopment) {
      console.log("🚀 Request sent:", config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  async (response: AxiosResponse) => {
    if (isDevelopment) {
      console.log("✅ Response received:", response.status, response.config.url);
      console.log("Response data:", response.data);
    }

    // 无感刷新 token
    if (response.data.code === 401 && !isRefreshRequest(response.config)) {
      // 刷新 token
      const isSuccess = await refreshAccessToken()
      if (!isSuccess) {
        // 博客不强制要求登录，刷新失败时不提示
        if (!isGetUserInfoRequest(response.config)) {
          toast.error('你没有当前权限，请先登录！或联系管理员')
        }
        return response;
      }
      // 刷新成功，重新请求
      const resp = await instance.request(response.config)
      return resp;
    }

    return response;
  },
  (error: AxiosError) => {
    console.error("Response error:", error);
    const url = error.config?.url ?? 'Unknown URL';
    const method = error.config?.method?.toUpperCase() ?? 'UNKNOWN_METHOD';
    const status = error.response?.status ?? 'NO_STATUS';

    if (shouldReport(error)) {
      reportError(`接口错误： ${method} ${url} ${error.message} ${status}`);
    }

    // 对于所有错误，继续向下传递
    return Promise.reject(error);
  }
);

// 封装常用的 HTTP 方法
export const http = {
  // GET 请求
  get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return instance.get(url, config);
  },

  // POST 请求
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return instance.post(url, data, config);
  },

  // PUT 请求
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return instance.put(url, data, config);
  },

  // DELETE 请求
  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return instance.delete(url, config);
  },

  // PATCH 请求
  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return instance.patch(url, data, config);
  },
};

// 导出 axios 实例，以便需要更复杂配置时使用
export default instance;

// 类型定义
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T | null;
}

// 封装带有统一响应格式的请求方法
export const api = {
  // GET 请求，返回统一格式
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await http.get<ApiResponse<T>>(url, config);
    return response.data;
  },

  // POST 请求，返回统一格式
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await http.post<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  // PUT 请求，返回统一格式
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await http.put<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  // DELETE 请求，返回统一格式
  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await http.delete<ApiResponse<T>>(url, config);
    return response.data;
  },

  // PATCH 请求，返回统一格式
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await http.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  },
};

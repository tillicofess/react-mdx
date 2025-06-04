import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

import { getApiConfig, isDevelopment } from "../config/env";

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

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    if (isDevelopment) {
      console.log("🚀 Request sent:", config.method?.toUpperCase(), config.url);
    }

    // 可以在这里添加 token
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

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
  (response: AxiosResponse) => {
    // 2xx 范围内的状态码都会触发该函数
    if (isDevelopment) {
      console.log("✅ Response received:", response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数
    if (isDevelopment) {
      console.error(
        "❌ Response error:",
        error.response?.status,
        error.response?.data
      );
    }

    // 统一错误处理
    if (error.response?.status === 401) {
      // 未授权，可以跳转到登录页
      console.warn("Unauthorized access - redirecting to login");
      // window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // 禁止访问
      console.warn("Access forbidden");
    } else if (error.response?.status >= 500) {
      // 服务器错误
      console.error("Server error");
    }

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
  data: T;
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

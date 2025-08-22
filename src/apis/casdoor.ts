import { http } from "@/lib/axios"
import type { AxiosRequestConfig } from "axios";

export async function getUserInfo() {
    const resp = await http.get('/api/user/userinfo', {
        __isGetUserInfo: true
    });
    return resp;
}

export function isGetUserInfoRequest(config: AxiosRequestConfig) {
    return !!config.__isGetUserInfo;
}

export async function refreshAccessToken() {
    const resp = await http.get('/api/user/refresh', {
        __isRefreshToken: true
    })
    return resp.data.code === 200;
}

export function isRefreshRequest(config: AxiosRequestConfig) {
    return !!config.__isRefreshToken;
}

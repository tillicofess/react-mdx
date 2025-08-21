import { http } from "@/lib/axios"
import type { AxiosRequestConfig } from "axios";

export async function refreshAccessToken() {
    const resp = await http.get('/api/user/refresh', {
        __isRefreshToken: true
    })
    return resp.data.code === 200;
}

export function isRefreshRequest(config: AxiosRequestConfig) {
    return !!config.__isRefreshToken;
}

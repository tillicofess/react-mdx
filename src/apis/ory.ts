import { http } from "@/lib/axios"
// import type { AxiosRequestConfig } from "axios";

// export async function getUserInfo() {
//     const resp = await http.get('/api/user/userinfo', {
//         __isGetUserInfo: true
//     });
//     return resp;
// }

// export function isGetUserInfoRequest(config: AxiosRequestConfig) {
//     return !!config.__isGetUserInfo;
// }

// export async function refreshAccessToken() {
//     const resp = await http.get('/api/user/refresh', {
//         __isRefreshToken: true
//     })
//     return resp.data.code === 200;
// }

// export function isRefreshRequest(config: AxiosRequestConfig) {
//     return !!config.__isRefreshToken;
// }

export const login = () => {
    const state = Math.random().toString(36).substring(2, 10);
    const params = new URLSearchParams({
        client_id: "68f98473-1547-4d84-9015-e838e743c872",
        response_type: "code",
        scope: "openid profile email offline_access",
        redirect_uri: "http://127.0.0.1:4000/callback",
        state,
    });

    localStorage.setItem("state", state);

    // 跳转到 hydra public /oauth2/auth
    window.location.href = `http://127.0.0.1:4444/oauth2/auth?${params.toString()}`;
};

export const reFreshToken = async () => {
    const data = {
        grant_type: "refresh_token",
        scope: "openid profile email offline_access",
        client_id: "68f98473-1547-4d84-9015-e838e743c872",
    }

    const resp = await http.post("http://127.0.0.1:3001/token", data, {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    });
    return resp.data.code === 200;
}

export const getUserInfo = async () => {
    try {
        const response = await http.get("http://127.0.0.1:3001/whoami", {
            withCredentials: true,
        });

        if (response.data && response.data.data) {
            return response.data.data.identity.traits;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Failed to fetch user info:", error);
        return null;
    }
};

export const logout = async () => {
    try {
        const response = await http.get("http://127.0.0.1:4433/self-service/logout/browser", {
            withCredentials: true,
        });

        const { logout_url } = response.data;
        const url = `${logout_url}&return_to=http://127.0.0.1:4000`;
        window.location.href = url;

    } catch (error) {
        console.error("Logout request failed:", error);
    }
};

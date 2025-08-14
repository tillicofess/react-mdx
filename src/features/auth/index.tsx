import { AuthCallback } from "casdoor-react-sdk";
import * as Setting from "./Setting";

export default function authCallback() {
    return (
        <AuthCallback
            sdk={Setting.CasdoorSDK}
            serverUrl={Setting.ServerUrl}
            saveTokenFromResponse={(res) => {
                localStorage.setItem("token", (res as any).accessToken);
                Setting.goToLink('/');
            }}
            isGetTokenSuccessful={(res) => {
                console.log(res)
                return !!(res as any).accessToken;
            }}
        />
    )
}
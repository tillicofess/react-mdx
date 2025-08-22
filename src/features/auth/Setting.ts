import Sdk from "casdoor-js-sdk";

const sdkConfig = {
    serverUrl: "https://auth.ticscreek.top",
    clientId: import.meta.env.VITE_CLIENT_ID,
    appName: import.meta.env.VITE_APP_NAME,
    organizationName: import.meta.env.VITE_ORGANIZATION_NAME,
    redirectPath: import.meta.env.VITE_REDIRECT_PATH,
};

export const CasdoorSDK = new Sdk(sdkConfig);

export function getSignupUrl() {
    return CasdoorSDK.getSignupUrl();
}

export function getSigninUrl() {
    return CasdoorSDK.getSigninUrl();
}

export function getUserProfileUrl(userName: any, account: any) {
    return CasdoorSDK.getUserProfileUrl(userName, account);
}

export function getMyProfileUrl(account: any) {
    return CasdoorSDK.getMyProfileUrl(account);
}

export function getMyResourcesUrl(account: any) {
    return CasdoorSDK.getMyProfileUrl(account).replace("/account?", "/resources?");
}

// export function signin() {
//     return CasdoorSDK.signin(ServerUrl);
// }

// export function showMessage(type: any, text: any) {

//     if (type === "") {
//         return;
//     } else if (type === "success") {
//         message.success(text);
//     } else if (type === "error") {
//         message.error(text);
//     }
// }

export function goToLink(link: any) {
    window.location.href = link;
}

export async function getUserInfo(token: string) {
    return await CasdoorSDK.getUserInfo(token);
}

export async function refreshAccessToken(refreshToken: string) {
    return await CasdoorSDK.refreshAccessToken(refreshToken);
}


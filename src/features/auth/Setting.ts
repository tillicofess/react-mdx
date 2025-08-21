import Sdk from "casdoor-js-sdk";

export const ServerUrl = "https://blog.ticscreek.top";

const sdkConfig = {
    serverUrl: "https://auth.ticscreek.top",
    clientId: "27af7d8ad24441bc8fac",
    appName: "blog",
    organizationName: "blog",
    redirectPath: "https://blog.ticscreek.top/api/user/callback",
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

export function signin() {
    return CasdoorSDK.signin(ServerUrl);
}

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


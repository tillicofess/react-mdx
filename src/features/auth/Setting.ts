import Sdk from "casdoor-js-sdk";

export const ServerUrl = "https://blog.ticscreek.top";


const sdkConfig = {
    serverUrl: "https://auth.ticscreek.top",
    clientId: "8ee311f6728aa06c0a95",
    appName: "blog",
    organizationName: "organization_bt380i",
    redirectPath: "/callback",
    signinPath: "/api/user/signin",
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

export function signin(serverUrl: any) {
    return CasdoorSDK.signin(serverUrl);
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

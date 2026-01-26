import { getConfig } from './config/index';
const originProto = XMLHttpRequest.prototype;
const originOpen = originProto.open;
const originSend = originProto.send;

export function isSupportSendBeacon() {
    return 'sendBeacon' in navigator;
}

const reportMethod = isSupportSendBeacon() ? beaconRequest : xhrRequest;

export function report(data: any) {
    const config = getConfig();
    if (!config.reportUrl) {
        console.error('[Monitor] reportUrl not configured');
        return;
    }
    const reportData = JSON.stringify(data);
    reportMethod(config.reportUrl, reportData);
}

export function xhrRequest(url: string, data: any) {
    if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(() => {
            const xhr = new XMLHttpRequest();
            originOpen.call(xhr, 'POST', url, true);
            originSend.call(xhr, JSON.stringify(data));
        });
    } else {
        setTimeout(() => {
            const xhr = new XMLHttpRequest();
            originOpen.call(xhr, 'POST', url, true);
            originSend.call(xhr, JSON.stringify(data));
        }, 0);
    }
}

export function beaconRequest(url: string, data: any) {
    if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(() => {
            navigator.sendBeacon(url, data);
        }, { timeout: 3000 });
    } else {
        setTimeout(() => {
            navigator.sendBeacon(url, data);
        }, 0);
    }
}
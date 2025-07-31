// src/utils/errorReporter.ts
import ErrorStackParser from 'error-stack-parser';
import { breadcrumb } from './breadcrumb';
import formatTime from '@/utils/utils';
import { eventsMatrix } from '@/main';

export function reportError(error: Error | string) {
    setTimeout(() => {
        let structuredError: any = {};
        let isResourceError = false;

        if (typeof error === 'string') {
            structuredError.message = error;
            isResourceError = true;
        } else {
            structuredError.message = error.message;

            try {
                const stackFrames = ErrorStackParser.parse(error);
                if (stackFrames.length > 0) {
                    const top = stackFrames[0];
                    structuredError.fileName = top.fileName;
                    structuredError.line = top.lineNumber;
                    structuredError.column = top.columnNumber;
                    structuredError.functionName = top.functionName;
                }
            } catch (e) {
                console.warn('解析堆栈失败:', e);
            }
        }


        let events: any[] = [];
        if (!isResourceError) {
            const len = eventsMatrix.length;
            if (len > 2) {
                events = eventsMatrix[len - 2].concat(eventsMatrix[len - 1]);
            } else {
                events = eventsMatrix[len - 1] || [];
            }
        }

        console.log('events', events);

        const payload = {
            error: structuredError,
            actions: breadcrumb.getStack(),
            events,
            time: formatTime(new Date()),
        };

        console.log('上报错误:', payload);
        localStorage.setItem('errorList', JSON.stringify(payload))
    }, 1000);
}


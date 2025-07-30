// src/utils/errorReporter.ts
import ErrorStackParser from 'error-stack-parser';
import { breadcrumb } from './breadcrumb';
import formatTime from '@/utils/utils';

export function reportError(error: Error | string) {
    setTimeout(() => {
        let structuredError: any = {};

        if (typeof error === 'string') {
            structuredError.message = error;
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

        const payload = {
            error: structuredError,
            actions: breadcrumb.getStack(),
            time: formatTime(new Date()),
        };

        console.log('上报错误:', payload);
        localStorage.clear()
        localStorage.setItem('errorList', JSON.stringify(payload))
    }, 1000);
}


import { format } from 'date-fns';

function formatTime(date: Date): string {
    return format(date, 'yyyy-MM-dd HH:mm:ss');
}

export default formatTime;
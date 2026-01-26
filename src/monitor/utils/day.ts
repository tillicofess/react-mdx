import dayjs from 'dayjs';

export function formatTime(date: Date): string {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}
import dayjs from 'dayjs';

function formatTime(date: Date): string {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

export default formatTime;
export function formatTime(sec) {
    if (!sec || sec <= 0) return "หมดเวลา";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

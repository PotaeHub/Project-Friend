import { useEffect, useState } from "react";
import socket from "../../socketCustomer";

export default function CustomerTimer({ tableId }) {
    const [remaining, setRemaining] = useState(null);

    useEffect(() => {
        socket.on("table:timer", payload => {
            const table = payload.find(t => t.tableId === tableId);
            if (table) {
                setRemaining(table.remainingSeconds);
            }
        });

        return () => {
            socket.off("table:timer");
        };
    }, [tableId]);

    const formatTime = (sec) => {
        if (sec == null) return "--:--:--";
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        return [h, m, s].map(v => String(v).padStart(2, "0")).join(":");
    };

    return (
        <div className="bg-black text-white rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-400">เวลาที่เหลือ</p>

            <div
                className={`text-3xl font-mono font-bold
                ${remaining <= 300 ? "text-red-500 animate-pulse" : ""}`}
            >
                {formatTime(remaining)}
            </div>

            {remaining === 0 && (
                <p className="text-red-500 mt-2 font-bold">
                    หมดเวลาแล้ว กรุณาแจ้งพนักงาน
                </p>
            )}
        </div>
    );
}

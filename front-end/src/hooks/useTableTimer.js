import { useEffect, useState } from "react";
import socket from "../socketCashier";

export default function useTableTimer() {
    const [tableTimers, setTableTimers] = useState({});

    useEffect(() => {
        const handler = (data) => {
            const map = {};
            data.forEach(t => {
                map[t.tableNumber] = t.remainingSeconds;
            });
            setTableTimers(map);
        };

        socket.on("table-timer", handler);

        return () => {
            socket.off("table-timer", handler);
        };
    }, []);

    return tableTimers;
}

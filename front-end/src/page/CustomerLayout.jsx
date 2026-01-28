// CustomerLayout.jsx
import { useEffect } from "react";
import socket from "../socketCustomer";

export default function CustomerLayout({ tableNumber }) {
    useEffect(() => {
        socket.connect();

        socket.emit("join-table", tableNumber);

        return () => socket.disconnect();
    }, [tableNumber]);

    return null;
}

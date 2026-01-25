import { useEffect, useState } from "react";
import socket from "../socketCustomer";
import api from "../axios";

export default function MenuPage() {
    const [cart, setCart] = useState([]);
    const [tableNumber, setTableNumber] = useState(null);

    useEffect(() => {
        const t = Number(new URLSearchParams(window.location.search).get("table"));
        if (t > 0) {
            setTableNumber(t);
            socket.emit("join-table", t);
        }
    }, []);

    const sendOrder = async () => {
        if (!cart.length) return alert("ไม่มีรายการ");

        await api.post("/orders", {
            tableNumber,
            items: cart
        });

        socket.emit("update-cart", {
            tableNumber,
            cart: []
        });

        setCart([]);
    };

    if (!tableNumber) return <div>❌ ไม่มีโต๊ะ</div>;

    return (
        <div className="p-4">
            <h1>🍽️ โต๊ะ {tableNumber}</h1>

            <button
                className="bg-orange-500 text-white px-4 py-2 rounded"
                onClick={sendOrder}
            >
                ส่งออเดอร์
            </button>
        </div>
    );
}

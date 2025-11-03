import { useEffect, useState } from "react";
import io from "socket.io-client";
import api from "../axios";

const socket = io("http://localhost:5000");

export default function KitchenPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        api.get("/orders").then(res => setOrders(res.data));
        socket.on("new-order", order => setOrders(prev => [order, ...prev]));
    }, []);

    const markDone = async id => {
        await api.put(`/orders/${id}/status`, { status: "done" });
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "done" } : o));
    };

    return (
        <div className="p-4 max-w-screen-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">ครัว</h1>
            {orders.map(order => (
                <div key={order.id} className="border p-4 rounded mb-4 bg-white shadow-lg transition-transform transform hover:scale-105">
                    <p className="font-semibold text-orange-600 text-lg">โต๊ะ {order.tableNumber}</p>
                    <ul className="ml-4 list-disc">
                        {order.items.map(i => (
                            <li key={i.id} className="text-gray-700">{i.menu.name} × {i.quantity}</li>
                        ))}
                    </ul>
                    <p className="text-gray-600">สถานะ: {order.status}</p>
                    {order.status !== "done" && (
                        <button onClick={() => markDone(order.id)} className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
                            เสร็จแล้ว
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import api from "../axios";

const socket = io("http://localhost:5000");

export default function HistoryPage() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const [tableNumber, setTableNumber] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlTable = Number(params.get("table"));
        if (!isNaN(urlTable) && urlTable > 0) setTableNumber(urlTable);

        // ดึง order ของโต๊ะนี้จาก backend
        api.get("/orders/history").then(res => {
            const filtered = res.data.filter(o => o.tableNumber === urlTable);
            setOrders(filtered);
        });

        // ฟัง realtime cart ของโต๊ะนี้
        socket.on(`cart-update-${urlTable}`, cart => {
            setOrders([{
                id: "cart-temp",
                tableNumber: urlTable,
                items: cart,
                createdAt: new Date().toISOString(),
                status: "pending",
            }]);
        });

        return () => socket.off(`cart-update-${urlTable}`);
    }, []);

    return (
        <div className="max-w-7xl mx-auto p-4 min-h-screen bg-gray-50">
            <button
                onClick={() => navigate(`/menu?table=${tableNumber}`)}
                className="mb-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg 
                transition-colors duration-200 flex items-center gap-2 shadow-sm"
            >
                <span>←</span>
                <span>กลับ</span>
            </button>

            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
                ประวัติการสั่งโต๊ะ {tableNumber}
            </h1>

            {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    ยังไม่มีรายการสำหรับโต๊ะนี้
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {orders.map(order => (
                        <div key={order.id}
                            className="border border-gray-200 p-6 rounded-xl shadow-sm 
                            bg-white hover:shadow-md transition-shadow duration-200"
                        >
                            <p className="font-semibold text-orange-600 mb-4 flex justify-between items-center">
                                <span className="text-lg">โต๊ะ {order.tableNumber}</span>
                                <span className="text-sm text-gray-600">
                                    {new Date(order.createdAt).toLocaleString()}
                                </span>
                            </p>
                            <ul className="space-y-3 mb-4">
                                {order.items.map(i => (
                                    <li key={i.menuId || i.id} className="flex justify-between items-center text-base">
                                        <span>{i.name || i.menu?.name} × {i.qty || i.quantity}</span>
                                        <span className="font-medium">
                                            {(i.price || i.menu?.price) * (i.qty || i.quantity)}฿
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t pt-3 mt-4">
                                <p className="font-medium flex justify-between text-lg">
                                    <span>รวม:</span>
                                    <span>{order.items.reduce((sum, i) =>
                                        sum + (i.price || i.menu?.price) * (i.qty || i.quantity), 0)}฿
                                    </span>
                                </p>
                                <p className="mt-3 flex justify-between items-center">
                                    <span>สถานะ:</span>
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${order.status === "done"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}>
                                        {order.status}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

import { useEffect, useState } from "react";
import api from "../axios";
import socket from "../socketAdmin";

export default function KitchenPage() {
    const [orders, setOrders] = useState([]);

    /* ===== LOAD ORDERS ===== */
    const loadOrders = async () => {
        const res = await api.get("/kitchen/orders");
        setOrders(res.data);
    };

    useEffect(() => {
        loadOrders();

        socket.on("order-confirmed", loadOrders);
        socket.on("order-status-updated", loadOrders);

        return () => {
            socket.off("order-confirmed");
            socket.off("order-status-updated");
        };
    }, []);

    /* ===== UPDATE STATUS ===== */
    const changeStatus = async (orderId, status) => {
        await api.patch(`/kitchen/orders/${orderId}`, { status });
    };

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">🍳 Kitchen</h1>

            {orders.map(order => (
                <div
                    key={order.id}
                    className="border rounded-xl p-4 shadow"
                >
                    <div className="flex justify-between mb-2">
                        <span className="font-bold">
                            โต๊ะ {order.tableNumber}
                        </span>

                        <span className={`font-bold
                            ${order.status === "PENDING" && "text-yellow-600"}
                            ${order.status === "COOKING" && "text-orange-600"}
                            ${order.status === "DONE" && "text-green-600"}
                        `}>
                            {order.status}
                        </span>
                    </div>

                    {order.items.map(item => (
                        <div key={item.id} className="text-sm">
                            {item.menu.name} x {item.qty}
                        </div>
                    ))}

                    {/* ===== ACTIONS ===== */}
                    <div className="flex gap-2 mt-3">
                        {order.status === "PENDING" && (
                            <button
                                onClick={() =>
                                    changeStatus(order.id, "COOKING")
                                }
                                className="px-3 py-1 bg-orange-500 text-white rounded"
                            >
                                เริ่มทำ
                            </button>
                        )}

                        {order.status === "COOKING" && (
                            <button
                                onClick={() =>
                                    changeStatus(order.id, "DONE")
                                }
                                className="px-3 py-1 bg-green-600 text-white rounded"
                            >
                                เสร็จแล้ว
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

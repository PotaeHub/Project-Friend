import { useEffect, useState } from "react";
import socket from "../../axiosAuth";
import api from "../axios";
import KitchenOrderCard from "../components/kitchen/KitchenOrderCard";

export default function KitchenPage() {
    const [orders, setOrders] = useState([]);
    const [loadingId, setLoadingId] = useState(null);

    /* ===== โหลดครั้งแรก ===== */
    useEffect(() => {
        const loadOrders = async () => {
            const res = await api.get("/kitchen/orders");
            setOrders(res.data);
        };
        loadOrders();
    }, []);

    /* ===== realtime ===== */
    useEffect(() => {
        socket.on("order:new", order => {
            setOrders(prev => [order, ...prev]);
        });

        socket.on("order:update", updated => {
            setOrders(prev =>
                prev.map(o => (o.id === updated.id ? updated : o))
            );
        });

        return () => {
            socket.off("order:new");
            socket.off("order:update");
        };
    }, []);

    /* ===== update status ===== */
    const updateStatus = async (id, status) => {
        try {
            setLoadingId(id);
            await api.patch(`/kitchen/orders/${id}`, { status });
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold mb-4">
                🍳 ออเดอร์ครัว
            </h1>

            {orders.length === 0 && (
                <div className="text-gray-500 text-center mt-10">
                    ไม่มีออเดอร์
                </div>
            )}

            {orders.map(order => (
                <KitchenOrderCard
                    key={order.id}
                    order={order}
                    loading={loadingId === order.id}
                    onUpdateStatus={updateStatus}
                />
            ))}
        </div>
    );
}

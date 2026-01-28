import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../axiosCustomer";

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchParams] = useSearchParams();
    const tableNumber = searchParams.get("table");

    useEffect(() => {
        if (!tableNumber) return;

        api.get(`/customer/orders/${tableNumber}`)
            .then(res => setOrders(res.data))
            .finally(() => setLoading(false));
    }, [tableNumber]);

    if (loading) {
        return <p className="p-4 text-center">กำลังโหลด...</p>;
    }

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold">
                ประวัติการสั่ง – โต๊ะ {tableNumber}
            </h2>

            {orders.length === 0 && (
                <p className="text-gray-400">ยังไม่มีประวัติการสั่ง</p>
            )}

            {orders.map(order => (
                <div
                    key={order.id}
                    className="border rounded-xl p-3 shadow space-y-2"
                >
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>
                            {new Date(order.createdAt).toLocaleString()}
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
                        <div
                            key={item.id}
                            className="flex justify-between text-sm"
                        >
                            <span>
                                {item.menu.name} x {item.qty}
                            </span>
                            <span>
                                {item.menu.price * item.qty} บาท
                            </span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

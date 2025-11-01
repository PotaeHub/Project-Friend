import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function HistoryPage() {
    const { tableNumber } = useParams();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3000/api/orders/table/${tableNumber}`).then(res => {
            setOrders(res.data);
        });
    }, [tableNumber]);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-3">ประวัติการสั่งโต๊ะ {tableNumber}</h1>
            {orders.map(order => (
                <div key={order.id} className="border p-3 rounded-lg mb-3 bg-white shadow">
                    <h2 className="font-semibold">Order #{order.id}</h2>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                    <ul className="mt-2">
                        {order.items.map(i => (
                            <li key={i.id}>🍽 {i.menu.name} x{i.quantity}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

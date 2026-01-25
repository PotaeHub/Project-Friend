import { useEffect, useState } from "react";
import socket from "../socketAdmin";
import api from "../axios";
export default function AdminDashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        // โหลดครั้งแรก
        api.get("/admin/dashboard").then(res => {
            setData(res.data);
        });

        // realtime
        socket.on("dashboard:update", setData);

        return () => socket.off("dashboard:update");
    }, []);

    if (!data) return <p className="p-6">Loading...</p>;
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
                📊 Dashboard (Realtime)
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card title="หมวดอาหาร" value={data.categories} icon="📂" />
                <Card title="เมนูอาหาร" value={data.menus} icon="🍜" />
                <Card title="ออเดอร์ทั้งหมด" value={data.orders} icon="🧾" />
                <Card title="ออเดอร์วันนี้" value={data.todayOrders} icon="📅" />
                <Card title="กำลังทำ" value={data.pendingOrders} icon="⏳" />
                <Card title="เสร็จแล้ว" value={data.doneOrders} icon="✅" />
            </div>

            <p className="mt-4 text-xs text-gray-400">
                🔄 อัปเดตแบบ Realtime (ไม่มีราคา)
            </p>
        </div>
    );
}

function Card({ title, value, icon }) {
    return (
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
            <div className="text-3xl">{icon}</div>
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    );
}

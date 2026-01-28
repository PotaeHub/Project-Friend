import { useEffect, useState } from "react";
import socket from "../socketAdmin";
import api from "../axios";
import KitchenOrderCard from "../components/KitchenOrderCard";
import { useAuth } from "../context/AuthContext";
import { Utensils, LogOut, Flame, Clock, ClipboardList } from "lucide-react";

export default function KitchenPage() {
    const [ordersByTable, setOrdersByTable] = useState({});
    const { logout } = useAuth();

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/kitchen/orders/${id}`, { status });
        } catch (err) {
            console.error("Update status failed", err);
        }
    };

    useEffect(() => {
        const loadOrders = async () => {
            const res = await api.get("/kitchen/orders");
            setOrdersByTable(res.data);
        };
        loadOrders();
    }, []);

    useEffect(() => {
        socket.on("order:new", order => {
            const tableNumber = order.buffetSession.table.number;
            setOrdersByTable(prev => ({
                ...prev,
                [tableNumber]: prev[tableNumber] ? [...prev[tableNumber], order] : [order]
            }));
        });

        socket.on("order:update", updated => {
            const tableNumber = updated.buffetSession.table.number;
            setOrdersByTable(prev => {
                const tableOrders = prev[tableNumber] || [];
                if (updated.status === "DONE") {
                    const filtered = tableOrders.filter(o => o.id !== updated.id);
                    if (filtered.length === 0) {
                        const copy = { ...prev };
                        delete copy[tableNumber];
                        return copy;
                    }
                    return { ...prev, [tableNumber]: filtered };
                }
                return {
                    ...prev,
                    [tableNumber]: tableOrders.map(o => o.id === updated.id ? updated : o)
                };
            });
        });

        socket.on("table:done", tableNumber => {
            setOrdersByTable(prev => {
                const copy = { ...prev };
                delete copy[tableNumber];
                return copy;
            });
        });

        return () => {
            socket.off("order:new");
            socket.off("order:update");
            socket.off("table:done");
        };
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-500 p-2.5 rounded-2xl shadow-lg shadow-orange-200">
                        <Flame className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-800 leading-none">KITCHEN CENTER</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time Order Monitoring</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-slate-100 px-4 py-2 rounded-xl hidden sm:flex items-center gap-2 border border-slate-200">
                        <ClipboardList size={16} className="text-slate-500" />
                        <span className="text-sm font-bold text-slate-600">
                            โต๊ะที่รอ: {Object.keys(ordersByTable).length}
                        </span>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-rose-500 text-white px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-md"
                    >
                        <LogOut size={18} />
                        <span className="font-bold text-sm">Logout</span>
                    </button>
                </div>
            </header>

            <main className="p-6">
                {Object.keys(ordersByTable).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 opacity-30 text-slate-400">
                        <Utensils size={80} strokeWidth={1} className="mb-4" />
                        <p className="text-xl font-bold italic tracking-wider">AWAITING NEW ORDERS...</p>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
                        {Object.entries(ordersByTable).map(([tableNumber, orders]) => (
                            <div
                                key={tableNumber}
                                className="break-inside-avoid bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                            >
                                {/* Table Header Inside Card */}
                                <div className="bg-slate-800 px-6 py-4 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-lg">
                                            {tableNumber}
                                        </div>
                                        <h2 className="text-white font-bold tracking-tight">โต๊ะ {tableNumber}</h2>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-orange-400 bg-orange-400/10 px-3 py-1 rounded-full border border-orange-400/20">
                                        <Clock size={14} />
                                        <span className="text-xs font-black uppercase tracking-tighter">ใหม่</span>
                                    </div>
                                </div>

                                {/* Order List Area */}
                                <div className="p-5 space-y-4 bg-slate-50/50">
                                    {orders.map(order => (
                                        <div key={order.id} className="animate-in fade-in slide-in-from-top-2 duration-300">
                                            <KitchenOrderCard
                                                order={order}
                                                onUpdateStatus={updateStatus}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Card Footer Summary */}
                                <div className="px-6 py-3 bg-white border-t border-slate-100 flex justify-end">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Total: {orders.length} Items
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
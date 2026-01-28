import { Clock, CheckCircle2, Utensils, X } from "lucide-react";
import { useState, useEffect } from "react";
import apiCustomer from "../axiosCustomer"
export default function HistoryModal({ sessionId, onClose }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!sessionId) return;
        setLoading(true);
        apiCustomer
            .get(`/customer/session/${sessionId}/orders`)
            .then(res => setOrders(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [sessionId]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-end z-50 animate-in fade-in duration-300">
            {/* Overlay สำหรับกดปิด */}
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="relative bg-gray-50 w-full max-w-lg max-h-[85vh] rounded-t-[2.5rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom-full duration-300">

                {/* Drag Handle */}
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-1"></div>

                <div className="p-6 overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-gray-800 tracking-tight">ประวัติการสั่ง</h2>
                            <p className="text-gray-500 text-sm flex items-center gap-1">
                                <Utensils size={14} /> รายการทั้งหมดที่คุณสั่งในมื้อนี้
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm border border-gray-100 active:scale-90"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="overflow-y-auto pr-1 flex-1 no-scrollbar">
                        {loading ? (
                            <div className="py-20 text-center space-y-3">
                                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <p className="text-gray-400 text-sm italic">กำลังดึงข้อมูลออเดอร์...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="py-20 text-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                                    📋
                                </div>
                                <p className="text-gray-500 font-bold">ยังไม่มีรายการที่สั่ง</p>
                                <p className="text-gray-400 text-sm">เริ่มสั่งอาหารจากเมนูได้เลย!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order, index) => (
                                    <div key={order.id} className="relative pl-8">
                                        {/* Timeline Line */}
                                        {index !== orders.length - 1 && (
                                            <div className="absolute left-[15px] top-8 bottom-[-24px] w-[2px] bg-gray-200"></div>
                                        )}

                                        {/* Timeline Dot */}
                                        <div className="absolute left-0 top-1 w-8 h-8 bg-white border-2 border-orange-500 rounded-full flex items-center justify-center z-10 shadow-sm">
                                            <Clock size={14} className="text-orange-500" />
                                        </div>

                                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                            <div className="flex justify-between items-start mb-3 pb-2 border-b border-gray-50">
                                                <div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Order ID</span>
                                                    <span className="font-bold text-gray-700">#{order.id.toString().slice(-4)}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Time</span>
                                                    <span className="text-sm font-medium text-gray-600">
                                                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                {order.items.map(item => (
                                                    <div key={item.id} className="flex justify-between items-center group">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-2 h-2 rounded-full bg-gray-200 group-hover:bg-orange-400 transition-colors"></div>
                                                            <span className="text-gray-700 font-medium">{item.menu.name}</span>
                                                        </div>
                                                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg text-xs font-bold">
                                                            × {item.qty}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Status Badge (แถมให้) */}
                                            <div className="mt-4 pt-3 border-t border-dashed border-gray-100 flex justify-end">
                                                <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                    <CheckCircle2 size={12} />
                                                    Ordered
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Button เพื่อปิด */}
                <div className="p-6 pt-2">
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl active:scale-95 transition-all shadow-lg"
                    >
                        กลับไปหน้าสั่งอาหาร
                    </button>
                </div>
            </div>
        </div>
    );
}
import { useEffect, useState } from "react";
import api from "../../axios";
import { X, Receipt, CheckCircle2, Loader2, Utensils } from "lucide-react";

export default function CloseTableModal({ table, onClose, onSuccess }) {
    const [aggregatedItems, setAggregatedItems] = useState([]);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [paymentType, setPaymentType] = useState("CASH");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // คำนวณยอดเงินรวมจาก Package (ราคาต่อหัว)
    const totalAmount = table.packages.reduce((sum, p) => sum + (p.price * p.qty), 0);

    useEffect(() => {
        const initData = async () => {
            try {
                // 1. ดึงข้อมูลออเดอร์เพื่อมาสรุปรายการอาหาร
                const summaryRes = await api.get(`/cashier/session-summary/${table.activeSessionId}`);
                const data = summaryRes.data;

                // Logic: รวมยอดรายการอาหารที่ซ้ำกันจากทุก Round
                const itemMap = {};
                data.orders.forEach(order => {
                    order.items.forEach(item => {
                        if (itemMap[item.name]) {
                            itemMap[item.name] += item.qty;
                        } else {
                            itemMap[item.name] = item.qty;
                        }
                    });
                });

                setAggregatedItems(Object.keys(itemMap).map(name => ({
                    name,
                    qty: itemMap[name]
                })));

                // 2. สร้าง QR Code
                const qrRes = await api.post("/payment/promptpay-qr", { amount: totalAmount });
                setQrCodeUrl(qrRes.data.qrCode);
            } catch (err) {
                console.error("Fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        if (table?.activeSessionId) initData();
    }, [table, totalAmount]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleCloseTable = async () => {
        setIsSubmitting(true);
        try {
            if (paymentType === "QR" && selectedFile) {
                const formData = new FormData();
                formData.append("slip", selectedFile);
                formData.append("buffetSessionId", table.activeSessionId);
                formData.append("amount", totalAmount);
                await api.post("/upload-slip", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            await api.post(`/cashier/close-table/${table.activeSessionId}`, {
                paymentType,
                paidAmount: totalAmount,
            });

            onSuccess();
        } catch (err) {
            alert(err.response?.data?.message || "เกิดข้อผิดพลาด");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-50 p-4 font-sans text-white">
            <div className="bg-[#1e293b] w-full max-w-xl rounded-[2.5rem] overflow-hidden border border-slate-700 shadow-2xl flex flex-col max-h-[95vh]">

                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500/20 p-2 rounded-xl">
                            <Receipt className="text-emerald-400" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black italic">CHECKOUT TABLE {table.number}</h2>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Session: #{table.activeSessionId}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                    {/* 1. ส่วนแสดง Package (ราคาหลัก) */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Selected Package</p>
                        {table.packages.map((pkg, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-slate-900/60 p-4 rounded-3xl border border-slate-800">
                                <div>
                                    <h4 className="font-black text-lg text-emerald-400 uppercase italic">{pkg.name}</h4>
                                    <p className="text-xl text-slate-400 font-bold">{pkg.qty} ท่าน x {pkg.price.toLocaleString()}.-</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black">{(pkg.qty * pkg.price).toLocaleString()}</span>
                                    <span className="text-[10px] ml-1 text-slate-500 font-bold">THB</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 2. ส่วนแสดงรายการอาหารที่สั่ง (Aggregated) */}
                    <div className="bg-slate-900/30 rounded-[2rem] p-5 border border-slate-800/50">
                        <div className="flex items-center gap-2 mb-3">
                            <Utensils size={14} className="text-slate-500" />
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Summary Items</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                            {aggregatedItems.length > 0 ? aggregatedItems.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-xs border-b border-slate-800/50 pb-1">
                                    <span className="text-slate-400 text-xl truncate max-w-[120px]">{item.name}</span>
                                    <span className="text-emerald-400 font-mono text-xl font-bold">x{item.qty}</span>
                                </div>
                            )) : (
                                <p className="text-slate-600 text-[10px] italic col-span-2">ไม่มีประวัติการสั่งอาหาร</p>
                            )}
                        </div>
                    </div>

                    {/* 3. ยอดชำระสุทธิ */}
                    <div className="bg-emerald-500/10 rounded-3xl p-6 border border-emerald-500/20 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <Receipt size={80} />
                        </div>
                        <p className="text-emerald-500/70 text-xs font-black uppercase tracking-widest mb-1">Net Amount</p>
                        <h3 className="text-5xl font-black text-white italic drop-shadow-lg">
                            {totalAmount.toLocaleString()} <small className="text-lg font-normal not-italic text-slate-500">฿</small>
                        </h3>
                    </div>

                    {/* 4. วิธีชำระเงิน & QR */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setPaymentType("CASH")} className={`py-4 rounded-2xl font-black border-2 transition-all ${paymentType === "CASH" ? "border-emerald-500 bg-emerald-500/10 text-white" : "border-slate-800 text-slate-500"}`}>💵 CASH</button>
                            <button onClick={() => setPaymentType("QR")} className={`py-4 rounded-2xl font-black border-2 transition-all ${paymentType === "QR" ? "border-emerald-500 bg-emerald-500/10 text-white" : "border-slate-800 text-slate-500"}`}>📱 QR PAY</button>
                        </div>

                        {paymentType === "QR" && (
                            <div className="flex gap-4 p-2 animate-in slide-in-from-bottom-2 duration-300">
                                <div className="bg-white p-3 rounded-2xl w-32 h-32 flex-shrink-0">
                                    {qrCodeUrl ? <img src={qrCodeUrl} className="w-full h-full" /> : <div className="w-full h-full flex items-center justify-center text-slate-900"><Loader2 className="animate-spin" /></div>}
                                </div>
                                <label className="flex-grow border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800/50 transition-all overflow-hidden bg-slate-900/20">
                                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                    {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <div className="text-center"><p className="text-[10px] font-black text-slate-500">UPLOAD SLIP</p></div>}
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 bg-slate-900/50 border-t border-slate-800">
                    <button
                        disabled={isSubmitting}
                        onClick={handleCloseTable}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 py-5 rounded-[1.8rem] font-black text-2xl shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-3 transition-all active:scale-95"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={28} />}
                        {isSubmitting ? "Processing..." : "ยืนยันปิดโต๊ะ"}
                    </button>
                </div>
            </div>
        </div>
    );
}
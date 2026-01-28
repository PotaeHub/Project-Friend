import { useEffect, useState } from "react";
import api from "../axios";
import Swal from "sweetalert2";
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    ClockIcon,
    CurrencyDollarIcon,
    GiftIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";

export default function AdminPackages() {
    const [packages, setPackages] = useState([]);
    const [form, setForm] = useState({ name: "", price: "", hours: "" });
    const [editing, setEditing] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadPackages = async () => {
        try {
            const res = await api.get("/admin/packages");
            setPackages(res.data);
        } catch {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "ไม่สามารถโหลดข้อมูลแพ็กเกจได้",
                confirmButtonColor: "#3b82f6"
            });
        }
    };

    useEffect(() => { loadPackages(); }, []);

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
    });

    const createPackage = async () => {
        if (!form.name || !form.price || !form.hours) {
            return Swal.fire("ข้อมูลไม่ครบ", "กรุณากรอกชื่อ ราคา และเวลาให้ครบถ้วน", "warning");
        }

        setIsSubmitting(true);
        try {
            await api.post("/admin/packages", {
                name: form.name,
                price: Number(form.price),
                timeLimit: Number(form.hours) * 60
            });
            setForm({ name: "", price: "", hours: "" });
            loadPackages();
            Toast.fire({ icon: "success", title: "เพิ่มแพ็กเกจใหม่สำเร็จ" });
        } catch {
            Swal.fire("ล้มเหลว", "ไม่สามารถสร้างแพ็กเกจได้", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const updatePackage = async () => {
        try {
            await api.put(`/admin/packages/${editing.id}`, {
                name: editing.name,
                price: Number(editing.price),
                timeLimit: Number(editing.hours) * 60
            });
            setEditing(null);
            loadPackages();
            Toast.fire({ icon: "success", title: "อัปเดตข้อมูลเรียบร้อย" });
        } catch {
            Swal.fire("ล้มเหลว", "ไม่สามารถบันทึกข้อมูลได้", "error");
        }
    };

    const deletePackage = async (id) => {
        const result = await Swal.fire({
            title: "ยืนยันการลบ?",
            text: "ข้อมูลนี้จะหายไปจากระบบและไม่สามารถกู้คืนได้",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "ยืนยันการลบ",
            cancelButtonText: "ยกเลิก"
        });

        if (!result.isConfirmed) return;

        try {
            await api.delete(`/admin/packages/${id}`);
            loadPackages();
            Swal.fire("สำเร็จ", "แพ็กเกจถูกลบเรียบร้อยแล้ว", "success");
        } catch {
            Swal.fire("ข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้", "error");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10 text-slate-800">
            <div className="max-w-6xl mx-auto">

                {/* Header Section */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                            <span className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                                <GiftIcon className="w-8 h-8 text-white" />
                            </span>
                            Buffet Packages
                        </h1>
                        <p className="mt-2 text-slate-500 font-medium">จัดการรายการราคาและเวลาสำหรับบุฟเฟต์ของคุณ</p>
                    </div>
                </div>

                {/* Create Section (Card) */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 mb-10 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        สร้างแพ็กเกจใหม่ <span className="text-blue-600 text-sm font-normal">| กรุณากรอกรายละเอียด</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">ชื่อแพ็กเกจ</label>
                            <input
                                placeholder="เช่น Gold Buffet"
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">ราคา (บาท)</label>
                            <input
                                placeholder="0.00"
                                type="number"
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">เวลา (ชม.)</label>
                            <input
                                placeholder="1.5"
                                type="number"
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                                value={form.hours}
                                onChange={(e) => setForm({ ...form, hours: e.target.value })}
                            />
                        </div>
                        <div className="flex items-end pb-1">
                            <button
                                onClick={createPackage}
                                disabled={isSubmitting}
                                className="w-full bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-2xl font-bold transition-all shadow-xl hover:shadow-blue-200 flex items-center justify-center gap-2 group disabled:opacity-50"
                            >
                                <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                {isSubmitting ? 'กำลังบันทึก...' : 'เพิ่มแพ็กเกจ'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400">
                                <th className="px-8 py-5 text-left text-xs uppercase font-black tracking-widest">ชื่อแพ็กเกจ</th>
                                <th className="px-6 py-5 text-left text-xs uppercase font-black tracking-widest">ราคา</th>
                                <th className="px-6 py-5 text-left text-xs uppercase font-black tracking-widest">ระยะเวลา</th>
                                <th className="px-8 py-5 text-center text-xs uppercase font-black tracking-widest">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {packages.map((p) => (
                                <tr key={p.id} className="group hover:bg-blue-50/30 transition-colors">
                                    <td className="px-8 py-6 font-bold text-lg text-slate-800">{p.name}</td>
                                    <td className="px-6 py-6 font-bold text-blue-600 text-xl">
                                        <span className="text-sm font-medium mr-1 text-slate-400">฿</span>
                                        {Number(p.price).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold">
                                            <ClockIcon className="w-4 h-4" />
                                            {p.timeLimit / 60} ชั่วโมง
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => setEditing({ ...p, hours: p.timeLimit / 60 })}
                                                className="p-3 text-blue-500 hover:bg-blue-100 rounded-2xl transition-all"
                                                title="แก้ไข"
                                            >
                                                <PencilSquareIcon className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={() => deletePackage(p.id)}
                                                className="p-3 text-red-400 hover:bg-red-50 rounded-2xl transition-all"
                                                title="ลบ"
                                            >
                                                <TrashIcon className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editing && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="font-black text-2xl tracking-tight text-slate-900">แก้ไขแพ็กเกจ</h2>
                            <button onClick={() => setEditing(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">ชื่อแพ็กเกจ</label>
                                <input
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-bold transition-all"
                                    value={editing.name}
                                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">ราคา</label>
                                    <input
                                        type="number"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-bold transition-all"
                                        value={editing.price}
                                        onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">เวลา (ชม.)</label>
                                    <input
                                        type="number"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-bold transition-all"
                                        value={editing.hours}
                                        onChange={(e) => setEditing({ ...editing, hours: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50 flex gap-4">
                            <button
                                onClick={updatePackage}
                                className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all"
                            >
                                บันทึกข้อมูล
                            </button>
                            <button
                                onClick={() => setEditing(null)}
                                className="flex-1 bg-white border border-slate-200 text-slate-500 font-bold py-4 rounded-2xl hover:bg-slate-100 transition-all"
                            >
                                ยกเลิก
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
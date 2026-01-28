import { useEffect, useState } from "react";
import api from "../axios";
import Swal from "sweetalert2";
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    XMarkIcon,
    ExclamationCircleIcon,
    Squares2X2Icon,
    ListBulletIcon
} from "@heroicons/react/24/outline";
import TableCard from "../components/cashier/TableCard";

export default function AdminTables() {
    const [tables, setTables] = useState([]);
    const [number, setNumber] = useState("");
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadTables = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/tables");
            // เรียงลำดับโต๊ะตามหมายเลขเสมอเพื่อให้ดูง่าย
            const sortedTables = res.data.sort((a, b) => a.number - b.number);
            setTables(sortedTables);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadTables(); }, []);

    const isDuplicate = (num) => tables.some((t) => t.number === Number(num));

    const createTable = async () => {
        setError("");
        if (!number) return setError("กรุณาระบุหมายเลขโต๊ะ");
        if (isDuplicate(number)) return setError(`โต๊ะหมายเลข ${number} มีอยู่แล้วในระบบ`);

        try {
            setLoading(true);
            await api.post("/admin/tables", { number: Number(number) });
            setNumber("");
            loadTables();
            const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
            Toast.fire({ icon: 'success', title: `เพิ่มโต๊ะ ${number} สำเร็จ` });
        } catch {
            setError("ไม่สามารถเพิ่มโต๊ะได้ในขณะนี้");
        } finally {
            setLoading(false);
        }
    };

    const updateTable = async () => {
        setError("");
        const duplicate = tables.find(t => t.number === Number(editing.number) && t.id !== editing.id);
        if (duplicate) return setError("หมายเลขโต๊ะซ้ำกับที่มีอยู่");

        try {
            await api.put(`/admin/tables/${editing.id}`, {
                number: Number(editing.number),
                status: editing.status
            });
            setEditing(null);
            loadTables();
        } catch {
            setError("บันทึกข้อมูลไม่สำเร็จ");
        }
    };

    const deleteTable = async (table) => {
        if (table.status === "OPEN") {
            return Swal.fire({
                icon: "warning",
                title: "ระงับการลบ",
                text: "โต๊ะนี้ยังมีลูกค้าใช้งานอยู่ (Status: OPEN)",
                confirmButtonColor: "#4f46e5"
            });
        }

        const result = await Swal.fire({
            title: `ลบโต๊ะหมายเลข ${table.number}?`,
            text: "ประวัติการเปิดโต๊ะนี้จะยังคงอยู่ในระบบ แต่โต๊ะจะหายไปจากหน้าจอหลัก",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            confirmButtonText: "ยืนยันการลบ",
            cancelButtonText: "ยกเลิก"
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/admin/tables/${table.id}`);
                loadTables();
                Swal.fire("Deleted!", "ลบโต๊ะเรียบร้อยแล้ว", "success");
            } catch {
                Swal.fire("Error", "เกิดข้อผิดพลาดในการลบ", "error");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* --- HEADER & ADD TABLE --- */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Table Management</h1>
                        <p className="text-slate-500 font-medium mt-1">ตั้งค่าและจัดการผังที่นั่งภายในร้าน</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative group">
                            <input
                                type="number"
                                value={number}
                                onChange={(e) => { setNumber(e.target.value); setError(""); }}
                                placeholder="หมายเลขโต๊ะใหม่"
                                className={`w-full sm:w-48 pl-5 pr-4 py-3.5 bg-white border-2 rounded-2xl outline-none transition-all font-bold ${error && !editing ? "border-rose-500 ring-4 ring-rose-50" : "border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"}`}
                            />
                            {error && !editing && (
                                <div className="absolute -bottom-6 left-1 text-rose-500 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                    <ExclamationCircleIcon className="w-3 h-3" /> {error}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={createTable}
                            disabled={loading}
                            className="bg-slate-900 hover:bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <PlusIcon className="w-5 h-5 stroke-[3]" />
                            เพิ่มโต๊ะ
                        </button>
                    </div>
                </div>

                {/* --- MAIN CONTENT GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT: TABLE LIST */}
                    <div className="lg:col-span-7 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
                            <ListBulletIcon className="w-4 h-4" /> Data Inventory
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                        <th className="px-8 py-4">ID Reference</th>
                                        <th className="px-4 py-4">Table No.</th>
                                        <th className="px-4 py-4">Current Status</th>
                                        <th className="px-8 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 ">
                                    {tables.map((t) => (
                                        <tr key={t.id} className="group hover:bg-indigo-50/30 transition-all">
                                            <td className="px-8 py-5 text-slate-300 font-mono text-sm">#{t.id}</td>
                                            <td className="px-4 py-5 font-black text-slate-700">โต๊ะ {t.number}</td>
                                            <td className="px-4 py-5">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${t.status === "EMPTY" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${t.status === "EMPTY" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`}></span>
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setEditing(t)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><PencilSquareIcon className="w-5 h-5" /></button>
                                                    <button onClick={() => deleteTable(t)} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><TrashIcon className="w-5 h-5" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* RIGHT: VISUAL PREVIEW */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="font-black text-slate-800 flex items-center gap-2 uppercase text-xs tracking-widest">
                                <Squares2X2Icon className="w-5 h-5 text-indigo-500" /> Live Layout Preview
                            </h2>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Available</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Occupied</span>
                                </div>
                            </div>
                        </div>

                        {/* พื้นหลังจำลองพื้นที่ร้าน */}
                        <div className="relative bg-slate-100 rounded-[2.5rem] p-8 border-2 border-dashed border-slate-200 min-h-[400px]">
                            {/* สัญลักษณ์ทางเข้า (ประดับเพื่อความสวยงาม) */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-6 py-1 border-2 border-slate-200 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                Entrance
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-6">
                                {tables.map((table) => (
                                    <div key={table.id} className="group relative">
                                        {/* ปุ่ม Quick Edit เล็กๆ มุมโต๊ะ */}
                                        <button
                                            onClick={() => setEditing(table)}
                                            className="absolute -top-2 -right-2 z-10 bg-white shadow-md p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-indigo-600"
                                        >
                                            <PencilSquareIcon className="w-3.5 h-3.5" />
                                        </button>

                                        <div className="transform group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300">
                                            <TableCard table={table} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {tables.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full py-20 text-slate-400 space-y-2">
                                    <Squares2X2Icon className="w-12 h-12 opacity-20" />
                                    <p className="font-bold">ยังไม่ได้จัดวางโต๊ะในระบบ</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- EDIT MODAL --- */}
                    {editing && (
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
                                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                    <div>
                                        <h2 className="font-black text-2xl text-slate-900">Edit Table</h2>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Update seated configuration</p>
                                    </div>
                                    <button onClick={() => setEditing(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><XMarkIcon className="w-6 h-6" /></button>
                                </div>

                                <div className="p-8 space-y-6">
                                    {error && (
                                        <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl flex gap-3 text-sm font-bold border border-rose-100">
                                            <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" /> {error}
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">หมายเลขโต๊ะ</label>
                                        <input
                                            type="number"
                                            value={editing.number}
                                            onChange={(e) => { setEditing({ ...editing, number: e.target.value }); setError(""); }}
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 font-black text-lg focus:bg-white focus:border-indigo-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">สถานะปัจจุบัน</label>
                                        <select
                                            value={editing.status}
                                            onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 font-bold focus:bg-white focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="EMPTY">🟢 EMPTY (ว่าง)</option>
                                            <option value="OPEN">🟡 OPEN (กำลังใช้งาน)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="p-8 bg-slate-50 flex gap-3">
                                    <button onClick={updateTable} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all">บันทึกข้อมูล</button>
                                    <button onClick={() => setEditing(null)} className="px-8 bg-white border border-slate-200 text-slate-500 font-bold py-4 rounded-2xl hover:bg-slate-100 transition-all">ยกเลิก</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
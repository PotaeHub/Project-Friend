import { useEffect, useState } from "react";
import api from "../axios";
import Swal from "sweetalert2";
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    XMarkIcon,
    ExclamationCircleIcon
} from "@heroicons/react/24/outline";

export default function AdminZones() {
    const [zones, setZones] = useState([]);
    const [name, setName] = useState("");
    const [editing, setEditing] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /* ================= LOAD ================= */

    const loadZones = async () => {
        const res = await api.get("/admin/zones");
        setZones(res.data);
    };

    useEffect(() => {
        loadZones();
    }, []);

    /* ================= CREATE ================= */

    const createZone = async () => {
        setError("");
        if (!name.trim()) return setError("กรุณาระบุชื่อ Zone");

        const dup = zones.find(
            (z) => z.name.toLowerCase() === name.toLowerCase()
        );
        if (dup) return setError("มี Zone นี้อยู่แล้ว");

        try {
            setLoading(true);
            await api.post("/admin/zones", { name });
            setName("");
            loadZones();

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "เพิ่ม Zone สำเร็จ",
                showConfirmButton: false,
                timer: 2000
            });
        } catch {
            setError("ไม่สามารถเพิ่ม Zone ได้");
        } finally {
            setLoading(false);
        }
    };

    /* ================= UPDATE ================= */

    const updateZone = async () => {
        setError("");
        if (!editing.name.trim()) return setError("ชื่อ Zone ห้ามว่าง");

        try {
            await api.put(`/admin/zones/${editing.id}`, {
                name: editing.name,
                isActive: editing.isActive
            });
            setEditing(null);
            loadZones();
        } catch {
            setError("บันทึกไม่สำเร็จ");
        }
    };

    /* ================= DELETE ================= */

    const deleteZone = async (zone) => {
        const result = await Swal.fire({
            title: `ลบ Zone "${zone.name}" ?`,
            text: "โต๊ะทั้งหมดใน Zone นี้จะไม่ถูกลบ แต่จะไม่ผูกกับ Zone",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            confirmButtonText: "ลบ",
            cancelButtonText: "ยกเลิก"
        });

        if (result.isConfirmed) {
            await api.delete(`/admin/zones/${zone.id}`);
            loadZones();
        }
    };

    /* ================= UI ================= */

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900">
                            Zone Management
                        </h1>
                        <p className="text-slate-500">
                            จัดการพื้นที่ / โซนในร้าน
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="ชื่อ Zone ใหม่"
                            className="px-5 py-3 rounded-2xl border-2 font-bold"
                        />
                        <button
                            onClick={createZone}
                            disabled={loading}
                            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-1"
                        >
                            <PlusIcon className="w-5 h-5" />
                            เพิ่ม
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-rose-50 text-rose-600 p-4 rounded-xl font-bold flex gap-2">
                        <ExclamationCircleIcon className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {/* LIST */}
                <div className="bg-white rounded-3xl shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 text-xs uppercase tracking-widest">
                            <tr>
                                <th className="p-4 text-left">Zone</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {zones.map((z) => (
                                <tr
                                    key={z.id}
                                    className="border-t hover:bg-slate-50"
                                >
                                    <td className="p-4 font-black text-slate-700">
                                        {z.name}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-black ${z.isActive
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-slate-200 text-slate-500"
                                                }`}
                                        >
                                            {z.isActive ? "ACTIVE" : "DISABLED"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button
                                            onClick={() =>
                                                setEditing({ ...z })
                                            }
                                            className="text-indigo-600"
                                        >
                                            <PencilSquareIcon className="w-5 h-5 inline" />
                                        </button>
                                        <button
                                            onClick={() => deleteZone(z)}
                                            className="text-rose-600"
                                        >
                                            <TrashIcon className="w-5 h-5 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {zones.length === 0 && (
                        <div className="p-12 text-center text-slate-400 font-bold">
                            ยังไม่มี Zone ในระบบ
                        </div>
                    )}
                </div>

                {/* EDIT MODAL */}
                {editing && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-3xl w-full max-w-md p-6 space-y-5">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-black">
                                    แก้ไข Zone
                                </h2>
                                <button
                                    onClick={() => setEditing(null)}
                                    className="p-2"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <input
                                value={editing.name}
                                onChange={(e) =>
                                    setEditing({
                                        ...editing,
                                        name: e.target.value
                                    })
                                }
                                className="w-full px-4 py-3 border rounded-xl font-bold"
                            />

                            <label className="flex items-center gap-3 font-bold">
                                <input
                                    type="checkbox"
                                    checked={editing.isActive}
                                    onChange={(e) =>
                                        setEditing({
                                            ...editing,
                                            isActive: e.target.checked
                                        })
                                    }
                                />
                                เปิดใช้งาน Zone
                            </label>

                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={updateZone}
                                    className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-black"
                                >
                                    บันทึก
                                </button>
                                <button
                                    onClick={() => setEditing(null)}
                                    className="flex-1 border py-3 rounded-xl font-bold"
                                >
                                    ยกเลิก
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

import { useEffect, useState } from "react";
import api from "../axios";
import Swal from "sweetalert2";
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
    ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import TableCard from "../components/cashier/TableCard";

export default function AdminTables() {
    const [tables, setTables] = useState([]);
    const [number, setNumber] = useState("");
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* ---------------- LOAD ---------------- */
    const loadTables = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/tables");
            setTables(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTables();
    }, []);

    /* ---------------- CREATE ---------------- */
    const isDuplicate = (num) =>
        tables.some((t) => t.number === Number(num));

    const createTable = async () => {
        setError("");
        if (!number) return setError("กรุณาระบุหมายเลขโต๊ะ");

        if (isDuplicate(number)) {
            return setError(`โต๊ะหมายเลข ${number} มีอยู่แล้ว`);
        }

        try {
            setLoading(true);
            await api.post("/admin/tables", { number: Number(number) });
            setNumber("");
            loadTables();
        } catch {
            setError("เพิ่มโต๊ะไม่สำเร็จ");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- UPDATE ---------------- */
    const updateTable = async () => {
        setError("");

        const duplicate = tables.find(
            (t) =>
                t.number === Number(editing.number) &&
                t.id !== editing.id
        );

        if (duplicate) {
            return setError("หมายเลขโต๊ะซ้ำ");
        }

        await api.put(`/admin/tables/${editing.id}`, {
            number: Number(editing.number),
            status: editing.status
        });

        setEditing(null);
        loadTables();
    };

    /* ---------------- DELETE ---------------- */
    const deleteTable = async (table) => {
        if (table.status === "OPEN") {
            return Swal.fire({
                icon: "warning",
                title: "ไม่สามารถลบได้",
                text: "โต๊ะนี้กำลังถูกใช้งานอยู่"
            });
        }

        const result = await Swal.fire({
            title: `ลบโต๊ะ ${table.number}?`,
            text: "การลบไม่สามารถกู้คืนได้",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "ลบโต๊ะ",
            cancelButtonText: "ยกเลิก"
        });

        if (!result.isConfirmed) return;

        try {
            await api.delete(`/admin/tables/${table.id}`);

            Swal.fire({
                icon: "success",
                title: "ลบโต๊ะสำเร็จ",
                timer: 1500,
                showConfirmButton: false
            });

            loadTables();
        } catch {
            Swal.fire({
                icon: "error",
                title: "ลบไม่สำเร็จ"
            });
        }
    };

    /* ---------------- UI ---------------- */
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Table Management</h1>
                        <p className="text-gray-500">จัดการโต๊ะทั้งหมด</p>
                    </div>

                    <div className="relative">
                        <div className={`flex gap-2 bg-white p-2 rounded-xl border ${error && !editing ? "border-red-500" : ""}`}>
                            <input
                                type="number"
                                value={number}
                                onChange={(e) => {
                                    setNumber(e.target.value);
                                    setError("");
                                }}
                                placeholder="หมายเลขโต๊ะ"
                                className="px-4 py-2 rounded-lg bg-gray-50"
                            />
                            <button
                                onClick={createTable}
                                disabled={loading}
                                className="bg-blue-600 text-white px-5 rounded-lg flex items-center gap-2"
                            >
                                <PlusIcon className="w-5 h-5" />
                                เพิ่มโต๊ะ
                            </button>
                        </div>

                        {error && !editing && (
                            <div className="absolute mt-2 text-red-500 text-sm flex gap-1">
                                <ExclamationTriangleIcon className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                {/* TABLE LIST */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-2xl border overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 text-xs text-gray-500">
                                <tr>
                                    <th className="p-4">ID</th>
                                    <th>โต๊ะ</th>
                                    <th>สถานะ</th>
                                    <th className="text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tables.map((t) => (
                                    <tr key={t.id} className="border-t hover:bg-gray-50">
                                        <td className="p-4 text-gray-400">#{t.id}</td>
                                        <td className="font-bold">โต๊ะ {t.number}</td>
                                        <td>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${t.status === "EMPTY"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-amber-100 text-amber-700"
                                                }`}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="flex justify-center gap-2 p-4">
                                            <button
                                                onClick={() => setEditing(t)}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => deleteTable(t)}
                                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* VISUAL */}
                    <div className="space-y-4">
                        <h2 className="font-bold">Visual Layout</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {tables.map((table) => (
                                <TableCard key={table.id} table={table} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* EDIT MODAL */}
                {editing && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl w-full max-w-md">
                            <div className="p-5 border-b flex justify-between">
                                <h2 className="font-bold">แก้ไขโต๊ะ</h2>
                                <button onClick={() => setEditing(null)}>
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-5 space-y-4">
                                {error && (
                                    <div className="bg-red-50 text-red-600 p-3 rounded-lg flex gap-2">
                                        <ExclamationTriangleIcon className="w-5 h-5" />
                                        {error}
                                    </div>
                                )}

                                <input
                                    value={editing.number}
                                    onChange={(e) => {
                                        setEditing({ ...editing, number: e.target.value });
                                        setError("");
                                    }}
                                    className="w-full border rounded-xl px-4 py-2"
                                />

                                <select
                                    value={editing.status}
                                    onChange={(e) =>
                                        setEditing({ ...editing, status: e.target.value })
                                    }
                                    className="w-full border rounded-xl px-4 py-2"
                                >
                                    <option value="EMPTY">EMPTY</option>
                                    <option value="OPEN">OPEN</option>
                                </select>
                            </div>

                            <div className="p-5 flex gap-2">
                                <button
                                    onClick={updateTable}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-xl"
                                >
                                    บันทึก
                                </button>
                                <button
                                    onClick={() => setEditing(null)}
                                    className="px-6 border rounded-xl"
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

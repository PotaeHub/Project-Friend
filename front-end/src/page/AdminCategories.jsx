import { useEffect, useState } from "react";
import api from "../axios";

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [name, setName] = useState("");

    const fetchCategories = async () => {
        const res = await api.get("/categories");
        setCategories(res.data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const openCreate = () => {
        setEditing(null);
        setName("");
        setShowModal(true);
    };

    const openEdit = (cat) => {
        setEditing(cat);
        setName(cat.name);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const submit = async () => {
        if (!name.trim()) return alert("กรุณาใส่ชื่อหมวด");

        if (editing) {
            await api.put(`/categories/${editing.id}`, { name });
        } else {
            await api.post("/categories", { name });
        }

        closeModal();
        fetchCategories();
    };

    const remove = async (id) => {
        if (!confirm("ลบหมวดนี้ใช่ไหม?")) return;
        await api.delete(`/categories/${id}`);
        fetchCategories();
    };

    return (
        <div className="p-6">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    📂 จัดการหมวดอาหาร
                </h1>

                <button
                    onClick={openCreate}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg shadow"
                >
                    + เพิ่มหมวด
                </button>
            </div>

            {/* LIST */}
            <div className="bg-white rounded-xl shadow divide-y">
                {categories.map((c, i) => (
                    <div
                        key={c.id}
                        className="flex justify-between items-center p-4 hover:bg-gray-50"
                    >
                        <div className="font-semibold text-gray-700">
                            {i + 1}. {c.name}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => openEdit(c)}
                                className="text-blue-600 hover:underline"
                            >
                                แก้ไข
                            </button>
                            <button
                                onClick={() => remove(c.id)}
                                className="text-red-600 hover:underline"
                            >
                                ลบ
                            </button>
                        </div>
                    </div>
                ))}

                {!categories.length && (
                    <p className="p-4 text-center text-gray-500">
                        ยังไม่มีหมวด
                    </p>
                )}
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-md p-6 animate-scale-in">
                        <h2 className="text-xl font-bold mb-4">
                            {editing ? "✏️ แก้ไขหมวด" : "➕ เพิ่มหมวด"}
                        </h2>

                        <input
                            className="border w-full p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            placeholder="ชื่อหมวดอาหาร"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 rounded bg-gray-300"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={submit}
                                className="px-4 py-2 rounded bg-orange-500 text-white"
                            >
                                บันทึก
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

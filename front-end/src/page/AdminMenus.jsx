import { useEffect, useState } from "react";
import api from "../axios";

export default function AdminMenus() {
    const [menus, setMenus] = useState([]);
    const [categories, setCategories] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);

    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    /* ---------------- FETCH ---------------- */
    const fetchMenus = async () => {
        const res = await api.get("/admin/menus");
        setMenus(res.data);
    };

    const fetchCategories = async () => {
        const res = await api.get("/categories");
        setCategories(res.data);
    };

    useEffect(() => {
        fetchMenus();
        fetchCategories();
    }, []);

    /* ---------------- MODAL ---------------- */
    const openCreate = () => {
        setEditing(null);
        setName("");
        setCategoryId("");
        setImage(null);
        setPreview(null);
        setShowModal(true);
    };

    const openEdit = (m) => {
        setEditing(m);
        setName(m.name);
        setCategoryId(m.categoryId);
        setPreview(m.image ? `http://localhost:5000${m.image}` : null);
        setImage(null);
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    /* ---------------- SUBMIT ---------------- */
    const submit = async () => {
        if (!name || !categoryId) {
            return alert("กรอกข้อมูลให้ครบ");
        }

        const fd = new FormData();
        fd.append("name", name);
        fd.append("categoryId", categoryId);
        if (image) fd.append("image", image);

        if (editing) {
            await api.put(`/menus/${editing.id}`, fd);
        } else {
            await api.post("/menus", fd);
        }

        closeModal();
        fetchMenus();
    };

    /* ---------------- DELETE ---------------- */
    const remove = async (id) => {
        if (!confirm("ลบเมนูนี้ใช่ไหม?")) return;
        await api.delete(`/menus/${id}`);
        fetchMenus();
    };

    /* ---------------- UI ---------------- */
    return (
        <div className="p-6">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">🍜 จัดการเมนูอาหาร</h1>
                <button
                    onClick={openCreate}
                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow"
                >
                    + เพิ่มเมนู
                </button>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {menus.map((m) => (
                    <div
                        key={m.id}
                        className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                    >
                        {m.image ? (
                            <img
                                src={`http://localhost:5000${m.image}`}
                                className="h-32 w-full object-cover"
                            />
                        ) : (
                            <div className="h-32 bg-gray-100 flex items-center justify-center text-gray-400">
                                ไม่มีรูป
                            </div>
                        )}

                        <div className="p-3">
                            <p className="font-semibold">{m.name}</p>
                            <p className="text-xs text-gray-400">
                                {m.category?.name}
                            </p>

                            <div className="flex justify-between mt-3">
                                <button
                                    onClick={() => openEdit(m)}
                                    className="text-blue-600 hover:underline"
                                >
                                    แก้ไข
                                </button>
                                <button
                                    onClick={() => remove(m.id)}
                                    className="text-red-600 hover:underline"
                                >
                                    ลบ
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-md p-6 animate-scale-in">
                        <h2 className="text-xl font-bold mb-4">
                            {editing ? "✏️ แก้ไขเมนู" : "➕ เพิ่มเมนู"}
                        </h2>

                        <input
                            className="border w-full p-2 rounded mb-3"
                            placeholder="ชื่อเมนู"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <select
                            className="border w-full p-2 rounded mb-3"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">เลือกหมวด</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setImage(file);
                                setPreview(URL.createObjectURL(file));
                            }}
                        />

                        {preview && (
                            <img
                                src={preview}
                                className="mt-3 h-32 w-full object-cover rounded"
                            />
                        )}

                        <div className="flex justify-end gap-2 mt-5">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 rounded bg-gray-300"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={submit}
                                className="px-4 py-2 rounded bg-green-500 text-white"
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

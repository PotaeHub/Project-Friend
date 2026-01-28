import { useEffect, useState } from "react";
import api from "../axios";
import { useAuth } from "../context/AuthContext";
import { Plus, Edit2, Trash2, Image as ImageIcon, X, Save, LogOut, Utensils } from "lucide-react";

export default function AdminMenus() {
    const [menus, setMenus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const { logout } = useAuth();
    const BASE_URL = "http://localhost:5000";

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
        setPreview(m.image ? `${BASE_URL}${m.image}` : null);
        setImage(null);
        setShowModal(true);
    };

    const submit = async () => {
        if (!name || !categoryId) return alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        const fd = new FormData();
        fd.append("name", name);
        fd.append("categoryId", categoryId);
        if (image) fd.append("image", image);

        try {
            if (editing) await api.put(`/menus/${editing.id}`, fd);
            else await api.post("/menus", fd);
            setShowModal(false);
            fetchMenus();
        } catch (err) {
            alert("เกิดข้อผิดพลาดในการบันทึก");
        }
    };

    const remove = async (id) => {
        if (!confirm("คุณต้องการลบเมนูนี้ใช่หรือไม่?")) return;
        await api.delete(`/menus/${id}`);
        fetchMenus();
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
            {/* --- HEADER --- */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200">
                        <Utensils className="text-white" size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">MENU SETTINGS</h1>
                        <p className="text-slate-400 text-sm font-medium">จัดการรายการอาหารและหมวดหมู่</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 active:scale-95"
                    >
                        <Plus size={20} />
                        เพิ่มเมนูใหม่
                    </button>
                    <button
                        onClick={logout}
                        className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors rounded-xl"
                        title="Logout"
                    >
                        <LogOut size={24} />
                    </button>
                </div>
            </div>

            {/* --- GRID --- */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {menus.map((m) => (
                    <div key={m.id} className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                            {m.image ? (
                                <img src={`${BASE_URL}${m.image}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-300">
                                    <ImageIcon size={48} strokeWidth={1} />
                                    <span className="text-xs font-bold mt-2 uppercase tracking-widest">No Image</span>
                                </div>
                            )}
                            <div className="absolute top-3 left-3">
                                <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-wider shadow-sm">
                                    {m.category?.name || 'ทั่วไป'}
                                </span>
                            </div>
                        </div>

                        <div className="p-5">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 line-clamp-1">{m.name}</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEdit(m)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 py-2.5 rounded-xl font-bold text-sm transition-colors"
                                >
                                    <Edit2 size={16} /> แก้ไข
                                </button>
                                <button
                                    onClick={() => remove(m.id)}
                                    className="w-12 flex items-center justify-center bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 py-2.5 rounded-xl transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MODAL --- */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">
                                {editing ? "EDIT MENU" : "CREATE NEW MENU"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Menu Name</label>
                                <input
                                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium"
                                    placeholder="เช่น ข้าวผัดปู"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                                <select
                                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium appearance-none"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                >
                                    <option value="">เลือกหมวดหมู่</option>
                                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Image Asset</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-4 hover:bg-slate-50 cursor-pointer transition-colors relative overflow-hidden">
                                        {preview ? (
                                            <img src={preview} className="h-24 w-full object-cover rounded-xl" />
                                        ) : (
                                            <>
                                                <ImageIcon className="text-slate-400 mb-1" size={24} />
                                                <span className="text-xs font-bold text-slate-500">Upload Photo</span>
                                            </>
                                        )}
                                        <input
                                            type="file" className="hidden" accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                setImage(file);
                                                setPreview(URL.createObjectURL(file));
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-200 transition-colors">
                                ยกเลิก
                            </button>
                            <button onClick={submit} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all">
                                <Save size={20} /> บันทึกข้อมูล
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
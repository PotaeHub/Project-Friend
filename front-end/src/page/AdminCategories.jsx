import { useEffect, useState } from "react";
import api from "../axios";
import { useAuth } from "../context/AuthContext";
import {
    FolderTree,
    Plus,
    Edit3,
    Trash2,
    X,
    Check,
    LogOut,
    Layers,
    ChevronRight
} from "lucide-react";

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [name, setName] = useState("");

    const { logout } = useAuth();

    const fetchCategories = async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data);
        } catch (err) {
            console.error("Fetch categories failed", err);
        }
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

    const submit = async () => {
        if (!name.trim()) return alert("กรุณาใส่ชื่อหมวดหมู่");
        try {
            if (editing) {
                await api.put(`/categories/${editing.id}`, { name });
            } else {
                await api.post("/categories", { name });
            }
            setShowModal(false);
            fetchCategories();
        } catch (err) {
            alert("บันทึกไม่สำเร็จ");
        }
    };

    const remove = async (id) => {
        if (!confirm("ลบหมวดหมู่จะส่งผลต่อเมนูข้างใน คุณต้องการดำเนินการต่อหรือไม่?")) return;
        await api.delete(`/categories/${id}`);
        fetchCategories();
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
            {/* --- HEADER --- */}
            <header className="max-w-4xl mx-auto flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <div className="bg-orange-500 p-3 rounded-2xl shadow-lg shadow-orange-200">
                        <FolderTree className="text-white" size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">CATEGORIES</h1>
                        <p className="text-slate-400 text-sm font-medium italic">Manage your food groupings</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={openCreate}
                        className="bg-white hover:bg-slate-800 hover:text-white text-slate-800 border-2 border-slate-800 px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 active:scale-95 shadow-sm"
                    >
                        <Plus size={20} />
                        เพิ่มหมวดหมู่
                    </button>
                    <button
                        onClick={logout}
                        className="p-2.5 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Logout"
                    >
                        <LogOut size={24} />
                    </button>
                </div>
            </header>

            {/* --- CONTENT LIST --- */}
            <main className="max-w-4xl mx-auto">
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="px-8 py-5 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Category Name</span>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Actions</span>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {categories.map((c, i) => (
                            <div
                                key={c.id}
                                className="group flex justify-between items-center px-8 py-5 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors">
                                        <Layers size={18} />
                                    </div>
                                    <span className="text-lg font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                                        {c.name}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEdit(c)}
                                        className="p-2.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                    <button
                                        onClick={() => remove(c.id)}
                                        className="p-2.5 text-rose-400 hover:bg-rose-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <ChevronRight className="text-slate-300 ml-2" size={16} />
                                </div>
                            </div>
                        ))}

                        {categories.length === 0 && (
                            <div className="py-20 flex flex-col items-center opacity-20">
                                <Layers size={64} strokeWidth={1} />
                                <p className="mt-4 font-bold tracking-widest uppercase text-sm">No Categories Found</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Info */}
                    <div className="px-8 py-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center border-t border-slate-100">
                        Total {categories.length} Categories Active
                    </div>
                </div>
            </main>

            {/* --- MODERN MODAL --- */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                                        {editing ? "RENAME CATEGORY" : "NEW CATEGORY"}
                                    </h2>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                                        {editing ? "Modify category details" : "Create a new food group"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-slate-100 p-2 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1">หมวดหมู่อาหาร</label>
                                    <input
                                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-lg text-slate-700"
                                        placeholder="เช่น เครื่องดื่ม, ของหวาน..."
                                        autoFocus
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && submit()}
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={submit}
                                        className="flex-[2] bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                                    >
                                        <Check size={20} />
                                        {editing ? "Update Category" : "Create Category"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
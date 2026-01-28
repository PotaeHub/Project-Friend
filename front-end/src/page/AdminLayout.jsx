// src/page/AdminLayout.jsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { LogOut, ShieldCheck, Bell, UserCircle } from "lucide-react";

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        if (window.confirm("คุณต้องการออกจากระบบ Admin ใช่หรือไม่?")) {
            localStorage.clear();
            navigate("/login");
        }
    };

    // ฟังก์ชันช่วยแสดงชื่อหน้าตาม Path ปัจจุบัน
    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes("menus")) return "Menu Management";
        if (path.includes("categories")) return "Category Management";
        if (path.includes("dashboard")) return "System Overview";
        return "Admin Panel";
    };

    return (
        <div className="min-h-screen flex bg-slate-50 font-sans">
            {/* Sidebar พื้นที่คงที่ด้านซ้าย */}
            <AdminSidebar />

            {/* พื้นที่หลักด้านขวา */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* --- MODERN TOP BAR --- */}
                <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-50 p-2 rounded-lg lg:hidden">
                            {/* สำหรับ Mobile Toggle ถ้ามี */}
                            <ShieldCheck className="text-indigo-600" size={24} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">
                                System Control
                            </h2>
                            <h1 className="text-xl font-black text-slate-800 tracking-tight">
                                {getPageTitle()}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Notification (สวยๆ ไว้ประดับ) */}
                        <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                            <Bell size={22} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>

                        {/* Admin Profile & Logout */}
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-black text-slate-800 leading-none">Super Admin</span>
                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Online</span>
                            </div>

                            <button
                                onClick={logout}
                                className="flex items-center gap-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 px-4 py-2.5 rounded-xl transition-all duration-300 font-bold text-sm border border-transparent hover:border-rose-100 group"
                            >
                                <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                                <span className="hidden md:block">Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* --- PAGE CONTENT --- */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                    {/* ขจัด p-6 ออกไปบางส่วนเพื่อให้หน้าย่อยจัดการ Padding เองได้อิสระ หรือจะค้างไว้ก็ได้ */}
                    <div className="animate-in fade-in duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
import { useState } from "react";
import api from "../axios";
import { useAuth } from "../context/AuthContext";
import { Lock, User, LogIn, Loader2 } from "lucide-react"; // ใช้ไอคอนช่วยให้ดูโปรขึ้น

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault(); // ป้องกันหน้าเว็บ Refresh
        setIsLoading(true);
        try {
            const res = await api.post("/auth/login", {
                username,
                password,
            });
            login(res.data.token);
        } catch (err) {
            alert("เข้าสู่ระบบไม่สำเร็จ: ชื่อผู้ใช้หรือรหัสผ่านผิด");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
            {/* Background Decor - เพิ่มลูกเล่นวงกลมฟุ้งๆ */}
            <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-orange-200 rounded-full blur-3xl opacity-30"></div>

            <div className="relative z-10 w-full max-w-md px-6">
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500 rounded-3xl shadow-xl shadow-orange-200 mb-4 rotate-3 transform transition-transform hover:rotate-0">
                        <UtensilsCrossed size={40} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                        POS <span className="text-orange-500">SYSTEM</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-2 font-medium">
                        Management & Kitchen Dashboard
                    </p>
                </div>

                {/* Card Container */}
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-white">
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Username Input */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                                Username
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-500 transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 pl-12 rounded-2xl outline-none transition-all focus:border-orange-500 focus:bg-white"
                                    placeholder="ใส่ชื่อผู้ใช้งาน"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-500 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 pl-12 rounded-2xl outline-none transition-all focus:border-orange-500 focus:bg-white"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>เข้าสู่ระบบ</span>
                                    <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Info */}
                <p className="text-center mt-8 text-slate-400 text-xs">
                    © 2024 Restaurant Management System <br />
                    Build with ❤️ for Your Kitchen
                </p>
            </div>
        </div>
    );
}

// สร้างไอคอนเสริม (ถ้าไม่มี Lucide)
function UtensilsCrossed({ size, className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" />
            <path d="M15 15 3.3 3.3a2 2 0 1 0-2.8 2.8L12.2 17.8a2 2 0 1 0 2.8-2.8Z" />
            <path d="m2 22 2.5-2.5" />
            <path d="m11 11 5-5" />
            <path d="m19 19 2.5 2.5" />
        </svg>
    )
}
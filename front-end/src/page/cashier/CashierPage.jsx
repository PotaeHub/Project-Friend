import { useEffect, useState } from "react";
import api from "../../axios";
import socket from "../../socketCashier";
import OpenTableModal from "../../components/cashier/OpenTableModal";
import { useAuth } from "../../context/AuthContext"; 
import { LayoutDashboard, Users, Clock, LogOut, Info } from "lucide-react";
export default function CashierPage() {
    const [tables, setTables] = useState([]);
    const [packages, setPackages] = useState([]);
    const [timers, setTimers] = useState({});
    const [selectedTable, setSelectedTable] = useState(null);
    const { logout } = useAuth(); 

    const loadData = async () => {
        try {
            const [tRes, pRes] = await Promise.all([
                api.get("/cashier/tables"),
                api.get("/cashier/packages")
            ]);
            setTables(tRes.data);
            setPackages(pRes.data);
        } catch (err) {
            console.error("Failed to load data", err);
        }
    };

    useEffect(() => {
        loadData();
        socket.on("table:update", loadData);

        socket.on("table:timer", data => {
            const map = {};
            data.forEach(d => { map[d.tableId] = d; });
            setTimers(map);
        });

        return () => {
            socket.off("table:update");
            socket.off("table:timer");
        };
    }, []);


    const formatTime = s => {
        if (s == null) return "-";
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 font-sans">
            {/* Header Section */}
            <header className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-4">
                    <div className="bg-orange-500 p-3 rounded-2xl shadow-lg shadow-orange-500/20">
                        <LayoutDashboard className="text-white" size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-1">CASHIER</h1>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Management System</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Status Summary Card */}
                    <div className="bg-slate-800/40 border border-slate-700/50 px-5 py-2.5 rounded-2xl hidden md:flex items-center gap-5">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-xs font-bold text-slate-400 uppercase">ว่าง: {tables.filter(t => t.status !== "OPEN").length}</span>
                        </div>
                        <div className="w-px h-4 bg-slate-700" />
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                            <span className="text-xs font-bold text-slate-400 uppercase">ไม่ว่าง: {tables.filter(t => t.status === "OPEN").length}</span>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-400 px-5 py-3 rounded-2xl transition-all duration-300 shadow-lg active:scale-95 group border border-slate-700/50 hover:border-rose-400"
                    >
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-sm">Logout</span>
                    </button>
                </div>
            </header>

            {/* Tables Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {tables.map(t => {
                    const timer = timers[t.id];
                    const isOpen = t.status === "OPEN";
                    const isUrgent = isOpen && timer?.remainingSeconds < 600;

                    return (
                        <button
                            key={t.id}
                            onClick={() => setSelectedTable({
                                ...t,
                                activeSessionId: timer?.sessionId,
                                remainingSeconds: timer?.remainingSeconds
                            })}
                            className={`
                                relative group overflow-hidden h-44 rounded-[2.5rem] p-5 flex flex-col justify-between
                                transition-all duration-300 transform active:scale-95 border-b-4
                                ${isOpen
                                    ? isUrgent
                                        ? "bg-rose-500 border-rose-700 shadow-xl shadow-rose-500/20 animate-pulse-slow text-white"
                                        : "bg-slate-800 border-slate-900 shadow-lg"
                                    : "bg-emerald-500 border-emerald-700 shadow-xl shadow-emerald-500/10 hover:bg-emerald-400 text-white"
                                }
                            `}
                        >
                            <div className="flex justify-between items-start w-full">
                                <div className={`
                                    w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner
                                    ${isOpen ? "bg-white/10" : "bg-white/20"}
                                `}>
                                    {t.number}
                                </div>
                                {isOpen && <Users size={18} className="opacity-40" />}
                            </div>

                            <div className="text-left">
                                <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 opacity-60`}>
                                    {isOpen ? "Time Remaining" : "Status"}
                                </span>

                                <div className="font-black text-2xl tracking-tighter flex items-center gap-2">
                                    {isOpen ? (
                                        <>
                                            <Clock size={20} className={isUrgent ? "animate-spin-slow" : "text-orange-400"} />
                                            {formatTime(timer?.remainingSeconds)}
                                        </>
                                    ) : (
                                        "AVAILABLE"
                                    )}
                                </div>
                            </div>

                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </button>
                    );
                })}
            </div>

            {/* Modal */}
            {selectedTable && (
                <OpenTableModal
                    table={selectedTable}
                    packages={packages}
                    onClose={() => setSelectedTable(null)}
                    onSuccess={() => {
                        setSelectedTable(null);
                        loadData();
                    }}
                />
            )}
        </div>
    );
}
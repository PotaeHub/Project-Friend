import { useEffect, useState } from "react";
import api from "../../axios";
import socket from "../../socketCashier";
import OpenTableModal from "../../components/cashier/OpenTableModal";
import { useAuth } from "../../context/AuthContext";
import {
    LayoutDashboard,
    Clock,
    LogOut,
    Wrench
} from "lucide-react";

export default function CashierPage() {
    const { logout } = useAuth();

    const [zones, setZones] = useState([]);
    const [activeZoneId, setActiveZoneId] = useState(null);

    const [tables, setTables] = useState([]);
    const [packages, setPackages] = useState([]);
    const [timers, setTimers] = useState({});
    const [selectedTable, setSelectedTable] = useState(null);

    /* ================= LOAD DATA ================= */
    const loadData = async () => {
        const [zRes, tRes, pRes] = await Promise.all([
            api.get("/cashier/zones"),
            api.get("/cashier/tables"),
            api.get("/cashier/packages"),
        ]);

        setZones(zRes.data);
        setTables(tRes.data);
        setPackages(pRes.data);

        if (!activeZoneId && zRes.data.length > 0) {
            setActiveZoneId(zRes.data[0].id);
        }
    };

    useEffect(() => {
        loadData();

        socket.on("table:update", loadData);
        socket.on("table:timer", (data) => {
            const map = {};
            data.forEach(d => (map[d.tableId] = d));
            setTimers(map);
        });

        return () => {
            socket.off("table:update");
            socket.off("table:timer");
        };
    }, []);

    /* ================= HELPERS ================= */
    const formatTime = (s) => {
        if (s == null) return "-";
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, "0")}`;
    };

    const activeZone = zones.find(z => z.id === activeZoneId);
    const zoneTables = tables.filter(t => t.zoneId === activeZoneId);

    /* ================= TOGGLE ZONE ================= */
    const toggleZone = async (zoneId) => {
        await api.patch(`/cashier/zones/${zoneId}/toggle`);
        loadData();
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8">

            {/* ================= HEADER ================= */}
            <header className="flex justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-orange-500 p-3 rounded-2xl">
                        <LayoutDashboard size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white">
                            CASHIER
                        </h1>
                        <p className="text-xs tracking-widest text-slate-400">
                            ZONE MANAGEMENT
                        </p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center gap-2 bg-slate-800 px-5 py-3 rounded-xl hover:bg-rose-500"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </header>

            {/* ================= ZONES ================= */}
            <div className="flex gap-3 mb-6">
                {zones.map(zone => {
                    const isOpen = zone.status === "OPEN";

                    return (
                        <div key={zone.id} className="relative flex items-center gap-2">
                            <button
                                onClick={() => setActiveZoneId(zone.id)}
                                className={`px-5 py-2 rounded-xl font-bold relative
                                    ${activeZoneId === zone.id
                                        ? "bg-white text-black"
                                        : "bg-slate-800"
                                    }
                                    ${!isOpen && "opacity-60"}
                                `}
                            >
                                {zone.name}

                                {!isOpen && (
                                    <span className="absolute -top-2 -right-2 text-[10px]
                                        bg-rose-600 text-white px-2 py-0.5 rounded-full">
                                        CLOSED
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() => toggleZone(zone.id)}
                                className={`p-2 rounded-lg
                                    ${isOpen ? "bg-emerald-600" : "bg-rose-600"}
                                `}
                                title="เปิด / ปิด โซน"
                            >
                                <Wrench size={16} />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* ================= ZONE CLOSED ALERT ================= */}
            {activeZone?.status === "CLOSED" && (
                <div className="mb-8 p-4 rounded-xl bg-rose-900/40
                    border border-rose-500 text-rose-300 font-semibold">
                    ⚠️ โซนนี้ปิดปรับปรุง ไม่สามารถเปิดโต๊ะได้
                </div>
            )}

            {/* ================= TABLES ================= */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
                {zoneTables.map(t => {
                    const timer = timers[t.id];
                    const isOpen = t.status === "OPEN";
                    const zoneClosed = activeZone?.status === "CLOSED";

                    return (
                        <div key={t.id} className="relative">
                            <button
                                disabled={zoneClosed}
                                onClick={() =>
                                    !zoneClosed &&
                                    setSelectedTable({
                                        ...t,
                                        activeSessionId: timer?.sessionId,
                                    })
                                }
                                className={`h-40 w-full rounded-3xl p-5 flex flex-col justify-between
                                    ${zoneClosed
                                        ? "bg-slate-700 opacity-40 cursor-not-allowed"
                                        : isOpen
                                            ? "bg-slate-800"
                                            : "bg-emerald-500 hover:bg-emerald-400"
                                    }`}
                            >
                                <div className="text-2xl font-black">
                                    โต๊ะ {t.number}
                                </div>

                                <div className="text-sm flex items-center gap-2">
                                    <Clock size={16} />
                                    {isOpen
                                        ? formatTime(timer?.remainingSeconds)
                                        : "AVAILABLE"}
                                </div>
                            </button>

                            {zoneClosed && (
                                <div className="absolute inset-0 flex items-center justify-center
                                    bg-black/60 rounded-3xl text-lg font-black text-rose-400">
                                    ZONE CLOSED
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ================= MODAL ================= */}
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

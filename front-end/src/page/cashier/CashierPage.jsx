import { useEffect, useState } from "react";
import api from "../../axios";
import socket from "../../socketCashier";
import OpenTableModal from "../../components/cashier/OpenTableModal";
import CloseTableModal from "../../components/cashier/CloseTableModal"; // เพิ่มตัวนี้
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, Clock, LogOut, Wrench } from "lucide-react";

export default function CashierPage() {
  const { logout } = useAuth();
  const [zones, setZones] = useState([]);
  const [activeZoneId, setActiveZoneId] = useState(null);
  const [tables, setTables] = useState([]);
  const [packages, setPackages] = useState([]);
  const [timers, setTimers] = useState({});

  // State สำหรับจัดการ Modal
  const [selectedTable, setSelectedTable] = useState(null); // สำหรับเปิดโต๊ะใหม่
  const [closingTable, setClosingTable] = useState(null);   // สำหรับสรุปยอด/ปิดโต๊ะ

  const loadData = async () => {
    try {
      const [zRes, tRes, pRes] = await Promise.all([
        api.get("/cashier/zones"),
        api.get("/cashier/tables"),
        api.get("/cashier/packages")
      ]);
      setZones(zRes.data);
      setTables(tRes.data);
      setPackages(pRes.data);
      if (!activeZoneId && zRes.data.length > 0) setActiveZoneId(zRes.data[0].id);
    } catch (err) { console.error("Load Data Error", err); }
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

  const formatTime = (s) => {
    if (s == null) return "-";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const activeZone = zones.find(z => z.id === activeZoneId);
  const zoneTables = tables.filter(t => t.zoneId === activeZoneId);

  const toggleZone = async (zoneId) => {
    await api.patch(`/cashier/zones/${zoneId}/toggle`);
    loadData();
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8">
      {/* HEADER เหมือนเดิม */}
      <header className="flex justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-orange-500 p-3 rounded-2xl shadow-lg shadow-orange-500/20">
            <LayoutDashboard size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">CASHIER</h1>
            <p className="text-xs tracking-[0.2em] text-slate-500 uppercase font-bold">Zone Management</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 bg-slate-800 px-5 py-3 rounded-xl hover:bg-rose-500 transition-all font-bold">
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* ZONES SELECTION เหมือนเดิม */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {zones.map(zone => (
          <div key={zone.id} className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setActiveZoneId(zone.id)}
              className={`px-6 py-2.5 rounded-xl font-bold relative transition-all ${activeZoneId === zone.id ? "bg-white text-black scale-105" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                } ${zone.status !== "OPEN" && "opacity-50"}`}
            >
              {zone.name}
              {zone.status !== "OPEN" && (
                <span className="absolute -top-2 -right-2 text-[9px] bg-rose-600 text-white px-2 py-0.5 rounded-full ring-2 ring-[#0f172a]">CLOSED</span>
              )}
            </button>
            <button onClick={() => toggleZone(zone.id)} className={`p-2.5 rounded-lg transition-colors ${zone.status === "OPEN" ? "bg-emerald-600/20 text-emerald-500" : "bg-rose-600/20 text-rose-500"}`}>
              <Wrench size={18} />
            </button>
          </div>
        ))}
      </div>

      {activeZone?.status === "CLOSED" && (
        <div className="mb-8 p-4 rounded-2xl bg-rose-900/20 border border-rose-500/30 text-rose-400 font-bold flex items-center gap-3">
          <span className="bg-rose-500 text-white p-1 rounded-lg text-xs">OFFLINE</span>
          โซนนี้ปิดให้บริการชั่วคราว ไม่สามารถเปิดโต๊ะใหม่ได้
        </div>
      )}

      {/* TABLES GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {zoneTables.map(t => {
          const timer = timers[t.id];
          const isOpen = t.status === "OPEN";
          const zoneClosed = activeZone?.status === "CLOSED";

          return (
            <div key={t.id} className="group">
              <button
                disabled={zoneClosed}
                onClick={() => {
                  if (isOpen) setClosingTable(t); // ถ้าเปิดอยู่ กดเพื่อเช็คบิล
                  else setSelectedTable(t);      // ถ้าว่าง กดเพื่อเปิดโต๊ะ
                }}
                className={`h-48 w-full rounded-[2rem] p-6 flex flex-col justify-between transition-all duration-300 text-left relative overflow-hidden shadow-xl
                  ${zoneClosed ? "bg-slate-800/40 opacity-40 cursor-not-allowed border-transparent" :
                    isOpen ? "bg-slate-800 border-2 border-slate-700 hover:border-emerald-500/50" :
                      "bg-emerald-500 hover:bg-emerald-400 hover:-translate-y-1 shadow-emerald-500/10"
                  }`}
              >
                {/* BG Glow for Active */}
                {isOpen && <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full" />}

                <div className="flex justify-between items-start z-10">
                  <div className={`text-3xl font-black ${isOpen ? "text-white" : "text-[#0f172a]"}`}>
                    {t.number}
                  </div>
                  {isOpen && (
                    <div className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter border border-emerald-500/20">
                      In Service
                    </div>
                  )}
                </div>

                <div className="z-10">
                  {isOpen ? (
                    <div className="space-y-2">
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 font-bold">
                        <Clock size={14} className="text-emerald-500" />
                        {formatTime(timer?.remainingSeconds)}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                        Click to Checkout
                      </div>
                    </div>
                  ) : (
                    <div className="text-[#0f172a] font-black text-sm flex items-center gap-1">
                      + OPEN TABLE
                    </div>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* MODAL: สำหรับเปิดโต๊ะใหม่ */}
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

      {/* MODAL: สำหรับสรุปยอดและปิดโต๊ะ */}
      {closingTable && (
        <CloseTableModal
          table={closingTable}
          onClose={() => setClosingTable(null)}
          onSuccess={() => {
            setClosingTable(null);
            loadData();
          }}
        />
      )}
    </div>
  );
}
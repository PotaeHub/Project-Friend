import { useEffect, useState } from "react";
import api from "../axios";

export default function AdminSessionHistory() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      const res = await api.get("/admin/sessions/history");
      console.log("HISTORY:", res.data);
      setSessions(res.data);
    } catch (err) {
      console.error("โหลดประวัติไม่สำเร็จ", err);
      alert("ไม่สามารถโหลดประวัติได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  if (loading) return <p className="p-6">กำลังโหลด...</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-black">📊 ประวัติการใช้งานทั้งหมด</h1>
      {sessions.length === 0 && (
        <p className="text-center text-slate-500">ยังไม่มีประวัติการใช้งาน</p>
      )}
      {sessions.map((s) => (
        <div key={s.id} className="bg-white rounded-2xl shadow p-5 space-y-4">
          {/* HEADER */}
          <div className="flex justify-between">
            <div>
              <p className="font-black text-lg">โต๊ะ {s.table.number}</p>
              <p className="text-sm text-slate-500">
                {new Date(s.startTime).toLocaleString()} →{" "}
                {new Date(s.endTime).toLocaleString()}
              </p>
            </div>

            <div className="text-right">
              <p className="font-bold">
                รวม{" "}
                {s.orders.reduce(
                  (sum, o) =>
                    sum +
                    o.items.reduce(
                      (iSum, i) => iSum + i.qty * (i.menu.price || 0),
                      0,
                    ),
                  0,
                )}{" "}
                บาท
              </p>
              <span className="text-xs bg-slate-100 px-3 py-1 rounded-full">
                {s.status}
              </span>
            </div>
          </div>

          {/* ORDERS */}
          {s.orders.map((o) => (
            <div key={o.id} className="bg-slate-50 rounded-xl p-4">
              <p className="font-bold mb-2">Order #{o.id}</p>
              <ul className="text-sm space-y-1">
                {o.items.map((i) => (
                  <li key={i.id} className="flex justify-between">
                    <span>{i.menu.name}</span>
                    <span>x{i.qty}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

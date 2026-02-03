import { useEffect, useState } from "react";
import api from "../axios";
import Swal from "sweetalert2";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  ExclamationCircleIcon,
  Squares2X2Icon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import TableCard from "../components/cashier/TableCard";

export default function AdminTables() {
  const [tables, setTables] = useState([]);
  const [zones, setZones] = useState([]);

  const [number, setNumber] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [sessions, setSessions] = useState([]);
  const [viewTable, setViewTable] = useState(null);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD DATA ================= */

  const loadTables = async () => {
    const res = await api.get("/admin/tables");
    setTables(res.data.sort((a, b) => a.number - b.number));
  };

  const loadZones = async () => {
    const res = await api.get("/admin/zones");
    setZones(res.data);
  };

  useEffect(() => {
    loadTables();
    loadZones();
  }, []);

  /* ================= VIEW ================= */
  const openHistory = async (table) => {
    setViewTable(table);
    setLoadingSessions(true);

    try {
      const res = await api.get(`/admin/tables/${table.id}/sessions`);
      setSessions(res.data);
    } catch (err) {
      Swal.fire("ผิดพลาด", "โหลดประวัติไม่สำเร็จ", "error");
    } finally {
      setLoadingSessions(false);
    }
  };

  /* ================= CREATE ================= */

  const isDuplicate = (num) => tables.some((t) => t.number === Number(num));

  const createTable = async () => {
    setError("");

    if (!number) return setError("กรุณาระบุหมายเลขโต๊ะ");
    if (!zoneId) return setError("กรุณาเลือก Zone");
    if (isDuplicate(number))
      return setError(`โต๊ะหมายเลข ${number} มีอยู่แล้ว`);

    try {
      setLoading(true);
      await api.post("/admin/tables", {
        number: Number(number),
        zoneId: Number(zoneId),
      });

      setNumber("");
      setZoneId("");
      loadTables();

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "เพิ่มโต๊ะสำเร็จ",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch {
      setError("ไม่สามารถเพิ่มโต๊ะได้");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE ================= */

  const updateTable = async () => {
    setError("");

    const dup = tables.find(
      (t) => t.number === Number(editing.number) && t.id !== editing.id,
    );
    if (dup) return setError("หมายเลขโต๊ะซ้ำ");

    try {
      await api.put(`/admin/tables/${editing.id}`, {
        number: Number(editing.number),
        status: editing.status,
        zoneId: Number(editing.zoneId),
      });
      setEditing(null);
      loadTables();
    } catch {
      setError("บันทึกไม่สำเร็จ");
    }
  };

  /* ================= DELETE ================= */

  const deleteTable = async (table) => {
    if (table.status === "OPEN") {
      return Swal.fire({
        icon: "warning",
        title: "ไม่สามารถลบได้",
        text: "โต๊ะกำลังถูกใช้งานอยู่",
      });
    }

    const result = await Swal.fire({
      title: `ลบโต๊ะ ${table.number}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      await api.delete(`/admin/tables/${table.id}`);
      loadTables();
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black">Table Management</h1>
            <p className="text-slate-500">จัดการโต๊ะ & Zone</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <input
              type="number"
              placeholder="หมายเลขโต๊ะ"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="px-5 py-3 rounded-2xl border-2 font-bold"
            />

            <select
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
              className="px-5 py-3 rounded-2xl border-2 font-bold"
            >
              <option value="">เลือก Zone</option>
              {zones.map((z) => (
                <option
                  key={z.id}
                  value={z.id}
                  disabled={z.status === "CLOSED"}
                >
                  {z.name} {z.status === "CLOSED" && "(ปิด)"}
                </option>
              ))}
            </select>

            <button
              onClick={createTable}
              className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black"
            >
              <PlusIcon className="w-5 h-5 inline" /> เพิ่มโต๊ะ
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-xl font-bold">
            {error}
          </div>
        )}

        {/* TABLE LIST */}
        <div className="bg-white rounded-3xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-widest">
                <th className="p-4">โต๊ะ</th>
                <th className="p-4">Zone</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((t) => (
                <tr key={t.id} className="border-t hover:bg-slate-50">
                  <td className="p-4 font-black">โต๊ะ {t.number}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black ${
                        t.zone?.status === "OPEN"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {t.zone?.name}
                      {t.zone?.status === "CLOSED" && " (ปิดปรับปรุง)"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black ${
                        t.status === "EMPTY"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <button
                    onClick={() => openHistory(t)}
                    className="text-slate-600"
                  >
                    <ListBulletIcon className="w-5 h-5 inline" />
                  </button>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setEditing(t)}
                      className="text-indigo-600"
                    >
                      <PencilSquareIcon className="w-5 h-5 inline" />
                    </button>
                    <button
                      onClick={() => deleteTable(t)}
                      className="text-rose-600"
                    >
                      <TrashIcon className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EDIT MODAL */}
        {editing && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl w-full max-w-md p-6 space-y-4">
              <h2 className="text-2xl font-black">แก้ไขโต๊ะ</h2>

              {error && <div className="text-rose-600 font-bold">{error}</div>}

              <input
                type="number"
                value={editing.number}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    number: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border rounded-xl font-bold"
              />

              <select
                value={editing.zoneId}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    zoneId: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border rounded-xl font-bold"
              >
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>

              <select
                value={editing.status}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    status: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border rounded-xl font-bold"
              >
                <option value="EMPTY">EMPTY</option>
                <option value="OPEN">OPEN</option>
              </select>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={updateTable}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-black"
                >
                  บันทึก
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="flex-1 border py-3 rounded-xl font-bold"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}
        {/* view */}
        {viewTable && (
          <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-start overflow-y-auto">
            <div className="bg-white w-full max-w-5xl rounded-3xl p-6 my-10 space-y-6">
              {/* HEADER */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black">
                  ประวัติการสั่ง – โต๊ะ {viewTable.number}
                </h2>
                <button onClick={() => setViewTable(null)}>
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {loadingSessions && (
                <div className="text-center text-slate-500">
                  กำลังโหลดข้อมูล...
                </div>
              )}

              {!loadingSessions && sessions.length === 0 && (
                <div className="text-center text-slate-500">
                  ยังไม่มีประวัติการใช้งาน
                </div>
              )}

              {/* SESSIONS */}
              <div className="space-y-6">
                {sessions.map((s) => (
                  <div
                    key={s.sessionId}
                    className="border rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="font-black">รอบที่ #{s.sessionId}</div>
                        <div className="text-sm text-slate-500">
                          {new Date(s.startTime).toLocaleString()}
                          {" → "}
                          {s.endTime
                            ? new Date(s.endTime).toLocaleString()
                            : "กำลังใช้งาน"}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold">รวม {s.total} บาท</div>
                        <span
                          className={`text-xs font-black px-3 py-1 rounded-full
                                    ${
                                      s.status === "FINISHED"
                                        ? "bg-slate-100 text-slate-600"
                                        : "bg-emerald-100 text-emerald-700"
                                    }`}
                        >
                          {s.status}
                        </span>
                      </div>
                    </div>

                    {/* ORDERS */}
                    {s.orders.map((o) => (
                      <div key={o.id} className="bg-slate-50 rounded-xl p-4">
                        <div className="flex justify-between mb-2">
                          <span className="font-bold">Order #{o.id}</span>
                          <span className="text-sm text-slate-500">
                            {o.status}
                          </span>
                        </div>

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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import api from "../axios";

export default function SessionHistoryPage() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    api.get("/admin/sessions/history").then((res) => {
      setSessions(res.data);
    });
  }, []);

  return (
    <div className="p-4 space-y-4">
      {sessions.map((s) => (
        <div key={s.id} className="border rounded p-4 bg-white shadow">
          <p>
            โต๊ะ: <b>{s.table.number}</b>
          </p>
          <p>
            Cashier: <b>{s.cashier.username}</b>
          </p>
          <p>
            เวลา: {new Date(s.startTime).toLocaleString()} -{" "}
            {new Date(s.endTime).toLocaleString()}
          </p>

          <hr className="my-2" />

          {s.orders.map((o) => (
            <div key={o.id}>
              {o.items.map((i) => (
                <p key={i.id}>
                  • {i.menu.name} x {i.qty}
                </p>
              ))}
            </div>
          ))}

          <p className="mt-2 text-green-600 font-bold">
            รวม: {s.slips.reduce((sum, slip) => sum + slip.amount, 0)} บาท
          </p>
        </div>
      ))}
    </div>
  );
}

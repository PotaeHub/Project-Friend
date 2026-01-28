import { useEffect, useState } from "react";
import api from "../../axios";
import socket from "../../socketCashier";
import OpenTableModal from "../../components/cashier/OpenTableModal";

export default function CashierPage() {
    const [tables, setTables] = useState([]);
    const [packages, setPackages] = useState([]);
    const [timers, setTimers] = useState({});
    const [selectedTable, setSelectedTable] = useState(null);

    const loadData = async () => {
        const [tRes, pRes] = await Promise.all([
            api.get("/cashier/tables"),
            api.get("/cashier/packages")
        ]);
        setTables(tRes.data);
        setPackages(pRes.data);
    };

    useEffect(() => {
        loadData();
        socket.on("table:update", loadData);

        socket.on("table:timer", data => {
            const map = {};
            data.forEach(d => {
                map[d.tableId] = d;
            });
            setTimers(map);
        });

        return () => {
            socket.off("table:update");
            socket.off("table:timer");
        };
    }, []);

    const format = s =>
        s == null ? "-" : `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold mb-6">🍽 Cashier</h1>

            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {tables.map(t => {
                    const timer = timers[t.id];
                    return (
                        <button
                            key={t.id}
                            onClick={() =>
                                setSelectedTable({
                                    ...t,
                                    activeSessionId: timer?.sessionId,
                                    remainingSeconds: timer?.remainingSeconds
                                })
                            }
                            className={`h-32 rounded-2xl flex flex-col justify-center items-center font-bold
                                ${t.status === "OPEN" ? "bg-red-600" : "bg-green-600"}`}
                        >
                            โต๊ะ {t.number}
                            {t.status === "OPEN" && (
                                <div className="text-sm mt-1">
                                    ⏱ {format(timer?.remainingSeconds)}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

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

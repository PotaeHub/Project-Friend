import { useState } from "react";
import api from "../../axios";
import Swal from "sweetalert2";
import {
    UserGroupIcon,
    BanknotesIcon,
    XMarkIcon,
    TicketIcon,
} from "@heroicons/react/24/outline";

export default function OpenTableModal({ table, packages, onClose, onSuccess }) {
    const [items, setItems] = useState([
        { packageId: "", qty: 1 }
    ]);
    const [paidAmount, setPaidAmount] = useState("");
    const [paymentType, setPaymentType] = useState("CASH");
    const [loading, setLoading] = useState(false);

    const addItem = () =>
        setItems([...items, { packageId: "", qty: 1 }]);

    const removeItem = (index) =>
        setItems(items.filter((_, i) => i !== index));

    const updateItem = (index, key, value) => {
        const copy = [...items];
        copy[index][key] = value;
        setItems(copy);
    };

    /* ===== เปิดโต๊ะ ===== */
    const openTable = async () => {
        if (items.some(i => !i.packageId || i.qty < 1)) {
            return Swal.fire("ข้อมูลไม่ครบ", "กรุณาเลือกแพ็กเกจและจำนวนลูกค้า", "warning");
        }

        try {
            setLoading(true);
            await api.post("/cashier/open-table", {
                tableId: table.id,
                packages: items.map(i => ({
                    packageId: Number(i.packageId),
                    qty: i.qty
                }))
            });

            Swal.fire("สำเร็จ", "เปิดโต๊ะเรียบร้อย", "success");
            onSuccess();
        } catch (e) {
            Swal.fire("ผิดพลาด", e.response?.data?.message || "เปิดโต๊ะไม่สำเร็จ", "error");
        } finally {
            setLoading(false);
        }
    };

    /* ===== ปิดโต๊ะ ===== */
    const closeTable = async () => {
        if (!paidAmount) {
            return Swal.fire("แจ้งเตือน", "กรุณากรอกจำนวนเงินที่รับมา", "warning");
        }

        try {
            setLoading(true);
            const res = await api.post(`/cashier/close-table/${table.activeSessionId}`, {
                paidAmount: Number(paidAmount),
                paymentType
            });

            Swal.fire({
                icon: "success",
                title: "ชำระเงินสำเร็จ",
                html: `
          <p>ยอดรวม: <b>${res.data.totalPrice.toLocaleString()}</b> บาท</p>
          <p style="color:green;font-size:1.2rem">
            เงินทอน: <b>${res.data.change.toLocaleString()}</b> บาท
          </p>
        `
            });

            onSuccess();
        } catch (e) {
            Swal.fire("ผิดพลาด", e.response?.data?.message || "ปิดโต๊ะไม่สำเร็จ", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 text-black">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-black">โต๊ะ {table.number}</h2>
                    <button onClick={onClose}>
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {table.status === "EMPTY" ? (
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={index} className="grid grid-cols-5 gap-2">
                                <select
                                    className="col-span-3 border rounded-xl p-2"
                                    value={item.packageId}
                                    onChange={e => updateItem(index, "packageId", e.target.value)}
                                >
                                    <option value="">เลือกแพ็กเกจ</option>
                                    {packages.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} ({p.price}฿)
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="number"
                                    min={1}
                                    className="border rounded-xl p-2"
                                    value={item.qty}
                                    onChange={e => updateItem(index, "qty", +e.target.value)}
                                />

                                <button
                                    onClick={() => removeItem(index)}
                                    className="text-red-600 font-bold"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={addItem}
                            className="w-full border border-dashed py-2 rounded-xl font-bold"
                        >
                            + เพิ่มแพ็กเกจ
                        </button>

                        <button
                            onClick={openTable}
                            disabled={loading}
                            className="w-full bg-black text-white py-3 rounded-xl font-black"
                        >
                            เปิดโต๊ะ
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="relative">
                            <BanknotesIcon className="w-6 h-6 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="number"
                                className="w-full pl-12 p-3 border rounded-xl text-xl font-black"
                                placeholder="รับเงิน"
                                value={paidAmount}
                                onChange={e => setPaidAmount(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {["CASH", "QR", "CARD"].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setPaymentType(t)}
                                    className={`py-2 rounded-xl font-bold border
                    ${paymentType === t ? "bg-black text-white" : ""}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={closeTable}
                            disabled={loading}
                            className="w-full bg-red-600 text-white py-3 rounded-xl font-black"
                        >
                            ปิดโต๊ะ & ชำระเงิน
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

import { useEffect, useState } from "react";
import api from "../../axios";
import Swal from "sweetalert2";
import {
    BanknotesIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

export default function OpenTableModal({ table, packages, onClose, onSuccess }) {

    /* ================= STATE ================= */
    const [items, setItems] = useState([{ packageId: "", qty: 1 }]);
    const [paidAmount, setPaidAmount] = useState("");
    const [paymentType, setPaymentType] = useState("CASH");
    const [loading, setLoading] = useState(false);

    const [totalPrice, setTotalPrice] = useState(0);
    const [qr, setQr] = useState(null);

    /* ================= HELPERS ================= */
    const addItem = () =>
        setItems([...items, { packageId: "", qty: 1 }]);

    const removeItem = (index) =>
        setItems(items.filter((_, i) => i !== index));

    const updateItem = (index, key, value) => {
        const copy = [...items];
        copy[index][key] = value;
        setItems(copy);
    };

    /* ================= CALC TOTAL (OPEN TABLE) ================= */
    useEffect(() => {
        if (table.status !== "EMPTY") return;

        const sum = items.reduce((acc, i) => {
            const pkg = packages.find(p => p.id === Number(i.packageId));
            return pkg ? acc + pkg.price * i.qty : acc;
        }, 0);

        setTotalPrice(sum);
    }, [items, packages, table.status]);

    /* ================= CALC TOTAL (ACTIVE SESSION) ================= */
    const sessionTotal = table.packages?.reduce(
        (sum, p) => sum + p.price * p.qty,
        0
    ) || 0;

    const total = table.status === "EMPTY" ? totalPrice : sessionTotal;

    /* ================= GENERATE QR ================= */
    const selectPaymentType = async (type) => {
        setPaymentType(type);
        setQr(null);

        if (type !== "QR") return;

        try {
            const res = await api.post("/payment/promptpay-qr", {
                amount: total
            });
            setQr(res.data.qrCode);
        } catch {
            Swal.fire("ผิดพลาด", "สร้าง QR ไม่สำเร็จ", "error");
        }
    };

    /* ================= OPEN TABLE ================= */
    const openTable = async () => {
        if (items.some(i => !i.packageId || i.qty < 1)) {
            return Swal.fire("ข้อมูลไม่ครบ", "กรุณาเลือกแพ็กเกจ", "warning");
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

            onClose(); // ⭐ ปิด modal
            await Swal.fire("สำเร็จ", "เปิดโต๊ะเรียบร้อย", "success");
            onSuccess();
        } catch (e) {
            Swal.fire("ผิดพลาด", e.response?.data?.message || "เกิดข้อผิดพลาด", "error");
        } finally {
            setLoading(false);
        }
    };

    /* ================= CLOSE TABLE ================= */
    const closeTable = async () => {
        const paid =
            paymentType === "QR"
                ? total
                : Number(paidAmount);

        if (paymentType !== "QR" && !paidAmount) {
            return Swal.fire("แจ้งเตือน", "กรุณากรอกจำนวนเงิน", "warning");
        }

        if (paid < total) {
            return Swal.fire("เงินไม่พอ", "ยอดรับเงินน้อยกว่ายอดรวม", "error");
        }

        const change = paid - total;

        const summaryHtml = `
            <div style="text-align:left">
                ${table.packages.map(p => `
                    <div style="display:flex;justify-content:space-between">
                        <span>${p.name} × ${p.qty}</span>
                        <span>${p.price * p.qty} ฿</span>
                    </div>
                `).join("")}
                <hr/>
                <p><b>ยอดรวม:</b> ${total} ฿</p>
                <p><b>รับเงิน:</b> ${paid} ฿</p>
                <p style="color:green"><b>เงินทอน:</b> ${change} ฿</p>
            </div>
        `;

        const { isConfirmed } = await Swal.fire({
            title: "ยืนยันการชำระเงิน",
            html: summaryHtml,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก"
        });

        if (!isConfirmed) return;

        try {
            setLoading(true);
            await api.post(
                `/cashier/close-table/${table.activeSessionId}`,
                { paymentType, paidAmount: paid }
            );

            onClose(); // ⭐ ปิด modal ก่อน
            await Swal.fire("สำเร็จ", "ปิดโต๊ะเรียบร้อย", "success");
            onSuccess();
        } catch (e) {
            Swal.fire("ผิดพลาด", e.response?.data?.message || "เกิดข้อผิดพลาด", "error");
        } finally {
            setLoading(false);
        }
    };

    /* ================= UI ================= */
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
                    /* ================= OPEN ================= */
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={index} className="grid grid-cols-5 gap-2">
                                <select
                                    className="col-span-3 border rounded-xl p-2"
                                    value={item.packageId}
                                    onChange={e =>
                                        updateItem(index, "packageId", e.target.value)
                                    }
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
                                    onChange={e =>
                                        updateItem(index, "qty", +e.target.value)
                                    }
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

                        <div className="font-black text-right">
                            รวม {total} ฿
                        </div>

                        <button
                            onClick={openTable}
                            disabled={loading}
                            className="w-full bg-black text-white py-3 rounded-xl font-black"
                        >
                            เปิดโต๊ะ
                        </button>
                    </div>
                ) : (
                    /* ================= PAYMENT ================= */
                    <div className="space-y-4">
                        <div className="border rounded-xl p-3 space-y-1">
                            {table.packages.map(p => (
                                <div key={p.id} className="flex justify-between">
                                    <span>{p.name} × {p.qty}</span>
                                    <span>{p.price * p.qty} ฿</span>
                                </div>
                            ))}
                            <hr />
                            <div className="flex justify-between font-black">
                                <span>รวม</span>
                                <span>{total} ฿</span>
                            </div>
                        </div>

                        {paymentType !== "QR" && (
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
                        )}

                        <div className="grid grid-cols-3 gap-2">
                            {["CASH", "QR", "CARD"].map(t => (
                                <button
                                    key={t}
                                    onClick={() => selectPaymentType(t)}
                                    className={`py-2 rounded-xl font-bold border
                                        ${paymentType === t ? "bg-black text-white" : ""}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        {paymentType === "QR" && qr && (
                            <div className="text-center space-y-2">
                                <p className="font-bold">สแกน PromptPay</p>
                                <img
                                    src={qr}
                                    alt="PromptPay QR"
                                    className="mx-auto w-56 border p-2 rounded"
                                />
                            </div>
                        )}

                        <button
                            onClick={closeTable}
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-black bg-red-600 text-white"
                        >
                            ปิดโต๊ะ & ชำระเงิน
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

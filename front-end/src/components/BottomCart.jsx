import { useState } from "react";

export default function BottomCart({ cart, onAdd, onRemove, onConfirm }) {
    const [open, setOpen] = useState(false);

    const totalQty = cart.reduce((s, i) => s + i.qty, 0);
    const totalPrice = cart.reduce((s, i) => s + i.qty * i.price, 0);

    if (totalQty === 0) return null;

    return (
        <>
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/40 z-40"
                />
            )}

            <div
                className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300
                ${open ? "translate-y-0" : "translate-y-[70%]"}`}
            >
                <div className="mx-auto max-w-xl bg-white rounded-t-3xl shadow-2xl overflow-hidden">

                    <div
                        onClick={() => setOpen(!open)}
                        className="p-4 border-b flex justify-between items-center cursor-pointer"
                    >
                        <div>
                            <p className="font-bold">🛒 {totalQty} รายการ</p>
                            <p className="text-orange-500 font-bold">
                                ฿ {totalPrice}
                            </p>
                        </div>
                        <span className="text-gray-400">
                            {open ? "▼" : "▲"}
                        </span>
                    </div>
                    <div className="max-h-72 overflow-y-auto px-4">
                        {cart.map(item => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center py-3 border-b"
                            >
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-400">
                                        ฿ {item.price}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => onRemove(item)}
                                        className="w-7 h-7 rounded-full bg-red-500 text-white"
                                    >
                                        -
                                    </button>
                                    <span>{item.qty}</span>
                                    <button
                                        onClick={() => onAdd(item)}
                                        className="w-7 h-7 rounded-full bg-green-500 text-white"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4">
                        <button
                            onClick={onConfirm}
                            className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600"
                        >
                            ยืนยันออเดอร์ ฿ {totalPrice}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

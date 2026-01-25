import { useCart } from "../context/CartContext";

export default function Cart({ cart, onSend, onClose }) {
    const { addToCart, decreaseQty, removeFromCart } = useCart();

    const total = cart.reduce(
        (sum, i) => sum + i.qty * (i.price || 0),
        0
    );

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-end">
            <div className="bg-white w-full max-w-md rounded-t-xl p-4">
                <h2 className="text-lg font-bold mb-3">รายการที่เลือก</h2>

                {cart.length === 0 && (
                    <p className="text-center text-gray-400">
                        ยังไม่มีรายการ
                    </p>
                )}

                {cart.map(item => (
                    <div
                        key={item.id}
                        className="flex justify-between items-center mb-3"
                    >
                        <div>
                            <div className="font-semibold">{item.name}</div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => decreaseQty(item.id)}
                                className="px-2 bg-gray-300 rounded"
                            >
                                –
                            </button>

                            <span>{item.qty}</span>

                            <button
                                onClick={() => addToCart(item)}
                                className="px-2 bg-gray-300 rounded"
                            >
                                +
                            </button>

                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="ml-2 text-red-600"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}

                <div className="mt-3 font-bold">
                    รวม: {total} บาท
                </div>

                <div className="flex gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-300 py-2 rounded"
                    >
                        ปิด
                    </button>
                    <button
                        disabled={cart.length === 0}
                        onClick={onSend}
                        className="flex-1 bg-green-600 text-white py-2 rounded disabled:opacity-50"
                    >
                        สั่งอาหาร
                    </button>
                </div>
            </div>
        </div>
    );
}

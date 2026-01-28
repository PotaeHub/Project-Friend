export default function Cart({ cart, onSend, onClose }) {
    const totalPrice = cart.reduce(
        (sum, i) => sum + i.price * i.qty,
        0
    );

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-end">
            <div className="w-80 bg-white h-full p-4 flex flex-col">
                <h2 className="text-lg font-bold mb-4">🛒 ตะกร้า</h2>

                <div className="flex-1 overflow-y-auto">
                    {cart.length === 0 && (
                        <p className="text-gray-500">ยังไม่มีรายการ</p>
                    )}

                    {cart.map(item => (
                        <div
                            key={item.id}
                            className="flex justify-between mb-2"
                        >
                            <span>
                                {item.name} x {item.qty}
                            </span>
                            <span>
                                {item.price * item.qty} ฿
                            </span>
                        </div>
                    ))}
                </div>

                <div className="border-t pt-3">
                    <div className="flex justify-between font-bold mb-3">
                        <span>รวม</span>
                        <span>{totalPrice} ฿</span>
                    </div>

                    <button
                        onClick={onSend}
                        disabled={!cart.length}
                        className="w-full bg-green-600 text-white py-2 rounded mb-2"
                    >
                        ส่งออเดอร์
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full bg-gray-300 py-2 rounded"
                    >
                        ปิด
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CartDrawer({
    open,
    cart,
    onClose,
    onAdd,
    onRemove,
    onConfirm
}) {
    if (!open) return null;

    const total = cart.reduce(
        (sum, i) => sum + i.price * i.qty,
        0
    );

    return (
        <div className="fixed inset-0 z-50">
            {/* overlay */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/40"
            />

            {/* drawer */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">🛒 ตะกร้าของคุณ</h2>
                    <button onClick={onClose}>✕</button>
                </div>

                {cart.length === 0 ? (
                    <p className="text-center text-gray-400 py-10">
                        ยังไม่มีเมนู
                    </p>
                ) : (
                    <div className="space-y-4">
                        {cart.map(item => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-medium">
                                        {item.name}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {item.price} ฿
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => onRemove(item)}
                                        className="w-8 h-8 rounded-full bg-red-500 text-white"
                                    >
                                        -
                                    </button>
                                    <span>{item.qty}</span>
                                    <button
                                        onClick={() => onAdd(item)}
                                        className="w-8 h-8 rounded-full bg-green-500 text-white"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="border-t mt-6 pt-4">
                    <div className="flex justify-between text-lg font-bold mb-4">
                        <span>รวม</span>
                        <span>{total.toLocaleString()} ฿</span>
                    </div>

                    <button
                        onClick={onConfirm}
                        className="w-full bg-orange-500 text-white py-3 rounded-xl text-lg"
                    >
                        ส่งออเดอร์
                    </button>
                </div>
            </div>
        </div>
    );
}

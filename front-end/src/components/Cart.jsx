export default function CartModal({
    cart,
    onAdd,
    onRemove,
    onSubmit,
    onClose
}) {
    const totalQty = cart.reduce((s, i) => s + i.qty, 0);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-end z-50 animate-in fade-in duration-300">
            {/* พื้นหลังที่กดปิดได้ */}
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="relative bg-white w-full max-w-lg max-h-[85vh] rounded-t-[2.5rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom-full duration-300">

                {/* Handle สำหรับลาก (UI Decor) */}
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-3 mb-1"></div>

                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-gray-800">ตะกร้าของคุณ</h2>
                            <p className="text-gray-500 text-sm">ตรวจสอบรายการอาหารก่อนสั่ง</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {/* รายการอาหาร (Scrollable Area) */}
                    <div className="overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar">
                        {cart.length === 0 ? (
                            <div className="py-12 text-center">
                                <span className="text-5xl mb-4 block">🛒</span>
                                <p className="text-gray-400 font-medium">ยังไม่มีรายการอาหารในตะกร้า</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100"
                                    >
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-800">{item.name}</div>
                                            <div className="text-orange-600 text-sm font-semibold">
                                                {item.qty} x
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                                            <button
                                                onClick={() => onRemove(item.id)}
                                                className="w-8 h-8 flex items-center justify-center text-orange-600 font-bold hover:bg-orange-50 rounded-lg transition-colors"
                                            >
                                                −
                                            </button>
                                            <span className="w-6 text-center font-bold text-gray-800">
                                                {item.qty}
                                            </span>
                                            <button
                                                onClick={() => onAdd(item)}
                                                className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white font-bold hover:bg-orange-600 rounded-lg shadow-sm transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer Section */}
                    {cart.length > 0 && (
                        <div className="mt-8 space-y-4">
                            <div className="flex justify-between items-center px-2">
                                <span className="text-gray-500 font-medium">ยอดรวมทั้งหมด</span>
                                <span className="text-2xl font-black text-orange-600">
                                    {totalQty} <span className="text-sm text-gray-400 font-normal">รายการ</span>
                                </span>
                            </div>

                            <button
                                onClick={onSubmit}
                                className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-bold py-4 rounded-2xl shadow-lg shadow-green-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                            >
                                <span>🚀</span>
                                ยืนยันส่งรายการอาหาร
                            </button>

                            <p className="text-center text-xs text-gray-400">
                                *รายการอาหารจะถูกส่งไปยังห้องครัวทันที
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default function MenuCard({ menu, qty, onAdd, onRemove }) {
    const hasQty = qty > 0;

    return (
        <div className={`group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 ${hasQty ? "shadow-lg ring-2 ring-orange-500" : "shadow-sm border border-gray-100 hover:shadow-md"
            }`}>
            {/* Image Section with Overlay */}
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={menu.image ? `${import.meta.env.VITE_BACKEND_URL}${menu.image}` : "/no-image.png"}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${hasQty ? "opacity-90" : ""
                        }`}
                    alt={menu.name}
                    onError={(e) => { e.target.src = "/no-image.png"; }}
                />
                {/* Badge แสดงจำนวนกรณีเลือกแล้วแบบ Compact */}
                {hasQty && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm shadow-md animate-bounce-subtle">
                        {qty}
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-3">
                <h3 className="font-bold text-gray-800 text-sm leading-tight h-10 line-clamp-2">
                    {menu.name}
                </h3>

                <div className="mt-3 flex items-center justify-center">
                    {!hasQty ? (
                        // ปุ่ม "เพิ่ม" ตอนที่ยังไม่เลือก (ดูสะอาดตา)
                        <button
                            onClick={onAdd}
                            className="w-full py-2 px-4 rounded-xl bg-gray-50 text-orange-600 font-bold text-sm border border-orange-100 hover:bg-orange-500 hover:text-white transition-all active:scale-95"
                        >
                            + เพิ่ม
                        </button>
                    ) : (
                        // ปุ่มปรับจำนวนตอนเลือกแล้ว (เน้นสีสัน)
                        <div className="flex items-center justify-between w-full bg-orange-100 rounded-xl p-1">
                            <button
                                onClick={onRemove}
                                className="w-8 h-8 rounded-lg bg-white text-orange-600 shadow-sm flex items-center justify-center hover:bg-orange-50 active:scale-90 transition-all"
                            >
                                <span className="text-xl font-bold">−</span>
                            </button>

                            <span className="font-black text-orange-700 mx-2">{qty}</span>

                            <button
                                onClick={onAdd}
                                className="w-8 h-8 rounded-lg bg-orange-500 text-white shadow-sm flex items-center justify-center hover:bg-orange-600 active:scale-90 transition-all"
                            >
                                <span className="text-xl font-bold">+</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
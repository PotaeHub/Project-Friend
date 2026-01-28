export default function HistoryModal({ orders, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
            <div className="bg-white w-full rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto">

                <div className="flex justify-between items-center mb-3">
                    <h2 className="font-bold text-lg">📜 ประวัติการสั่ง</h2>
                    <button onClick={onClose}>❌</button>
                </div>

                {orders.length === 0 && (
                    <p className="text-center text-gray-500">
                        ยังไม่มีรายการสั่ง
                    </p>
                )}

                {orders.map(order => (
                    <div
                        key={order.id}
                        className="border rounded-lg p-3 mb-3"
                    >
                        <div className="flex justify-between text-sm mb-2">
                            <span>#{order.id}</span>
                            <span>
                                {new Date(order.createdAt).toLocaleTimeString()}
                            </span>
                        </div>

                        {order.items.map(item => (
                            <div
                                key={item.id}
                                className="flex justify-between text-sm"
                            >
                                <span>
                                    {item.menu.name} x {item.qty}
                                </span>
                            </div>
                        ))}

                        <p className="text-xs mt-1 text-gray-500">
                            สถานะ: {order.status}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

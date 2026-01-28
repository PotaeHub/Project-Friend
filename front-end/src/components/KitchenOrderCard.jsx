export default function KitchenOrderCard({ order, onUpdateStatus }) {
    return (
        <div className="border rounded-lg p-3 bg-white shadow">
            <div className="flex justify-between items-center mb-2">
                <div className="font-semibold">
                    Order #{order.id}
                </div>

                <button
                    onClick={() => onUpdateStatus(order.id, "DONE")}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                >
                    เสร็จแล้ว
                </button>
            </div>

            <ul className="space-y-1">
                {order.items.map(item => (
                    <li
                        key={item.id}
                        className="flex justify-between text-sm"
                    >
                        <span>{item.menu.name}</span>
                        <span className="font-semibold">
                            x{item.qty}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

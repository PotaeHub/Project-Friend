export default function KitchenOrderCard({ order, onUpdateStatus }) {
    const statusColor = {
        PENDING: "bg-yellow-100 border-yellow-400",
        COOKING: "bg-blue-100 border-blue-400",
        DONE: "bg-green-100 border-green-400"
    };

    return (
        <div className={`border-l-4 rounded p-4 shadow ${statusColor[order.status]}`}>
            <div className="flex justify-between items-center mb-2">
                <h2 className="font-bold text-lg">
                    โต๊ะ {order.tableNumber}
                </h2>
                <span className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleTimeString()}
                </span>
            </div>

            <ul className="mb-3">
                {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                        <span>
                            {item.menu.name} x {item.qty}
                        </span>
                        <span>
                            {item.menu.price * item.qty} ฿
                        </span>
                    </li>
                ))}
            </ul>

            <div className="flex gap-2">
                {order.status === "PENDING" && (
                    <button
                        onClick={() => onUpdateStatus(order.id, "COOKING")}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                        เริ่มทำ
                    </button>
                )}

                {order.status === "COOKING" && (
                    <button
                        onClick={() => onUpdateStatus(order.id, "DONE")}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                        เสร็จแล้ว
                    </button>
                )}

                {order.status === "DONE" && (
                    <span className="text-green-700 font-semibold">
                        ✔ เสร็จแล้ว
                    </span>
                )}
            </div>
        </div>
    );
}

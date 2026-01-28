export default function MenuCard({ menu, qty, onAdd, onRemove }) {
    return (
        <div className="bg-white rounded-xl shadow p-3">
            <img
                src={
                    menu.image
                        ? `${import.meta.env.VITE_BACKEND_URL}${menu.image}`
                        : "/no-image.png"
                }
                className="w-full h-32 object-cover rounded"
                onError={(e) => {
                    e.target.src = "/no-image.png";
                }}
            />

            <h3 className="mt-2 font-semibold text-sm">
                {menu.name}
            </h3>

            {/* ===== BUTTON ===== */}
            <div className="flex items-center justify-between mt-2">
                <button
                    onClick={onRemove}
                    className="w-8 h-8 rounded-full bg-gray-200 text-lg"
                >
                    −
                </button>

                <span className="font-bold text-lg">{qty}</span>

                <button
                    onClick={onAdd}
                    className="w-8 h-8 rounded-full bg-black text-white text-lg"
                >
                    +
                </button>
            </div>
        </div>
    );
}

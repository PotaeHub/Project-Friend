export default function MenuCard({ item, onAdd, onRemove }) {
    return (
        <div className="bg-white rounded-2xl shadow p-3 flex flex-col">
            <img
                src={import.meta.env.VITE_BACKEND_URL + item.image}
                className="h-32 object-cover rounded-xl"
            />

            <h3 className="font-semibold mt-2">{item.name}</h3>
            <p className="text-orange-500 font-bold">
                {item.price} ฿
            </p>

            <div className="flex justify-between items-center mt-auto">
                <button
                    onClick={onRemove}
                    disabled={item.qty === 0}
                    className="w-8 h-8 bg-red-500 text-white rounded-full disabled:opacity-30"
                >
                    -
                </button>

                <span>{item.qty}</span>

                <button
                    onClick={onAdd}
                    className="w-8 h-8 bg-green-500 text-white rounded-full"
                >
                    +
                </button>
            </div>
        </div>
    );
}

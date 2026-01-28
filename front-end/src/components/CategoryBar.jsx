export default function CategoryBar({
    categories,
    activeCat,
    onSelect
}) {
    return (
        <div className="flex gap-2 px-4 py-3 overflow-x-auto">
            {categories.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => onSelect(cat.id)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap
                        ${activeCat === cat.id
                            ? "bg-black text-white"
                            : "bg-gray-200"}
                    `}
                >
                    {cat.name}
                </button>
            ))}
        </div>
    );
}

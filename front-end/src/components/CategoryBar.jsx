export default function CategoryBar({ categories, active, onChange }) {
    return (
        <div className="flex gap-3 overflow-x-auto p-3">
            {categories.map(c => (
                <button
                    key={c.id}
                    onClick={() => onChange(c.id)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap
                        ${active === c.id
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                >
                    {c.name}
                </button>
            ))}
        </div>
    );
}

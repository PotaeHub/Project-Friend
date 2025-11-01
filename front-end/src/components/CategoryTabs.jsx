export default function CategoryTabs({ categories, selected, onSelect }) {
    return (
        <div className="flex overflow-x-auto scrollbar-hide py-3 mb-4 px-2 sm:px-4 max-w-full">
            <div className="flex space-x-3 sm:space-x-4">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => onSelect(cat.id)}
                        className={`
                            whitespace-nowrap px-4 py-2 rounded-full text-sm sm:text-base
                            transition-all duration-200 ease-in-out
                            hover:scale-105 active:scale-95
                            ${selected === cat.id
                                ? 'bg-orange-500 text-white shadow-md hover:bg-orange-600'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }
                        `}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

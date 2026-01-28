import { LayoutGrid } from "lucide-react"; // แนะนำให้ลง lucide-react เพื่อใช้ไอคอน

export default function CategoryBar({
    categories,
    activeCat,
    onSelect
}) {
    return (
        <div className="bg-white pt-2 border-b border-gray-50">
            {/* Label Section - แยกไว้นิ่งๆ ด้านบน หรือใส่รวมให้ดูพรีเมียม */}
            <div className="px-5 flex items-center gap-2 mb-1">
                <div className="p-1 bg-orange-100 rounded-md text-orange-600">
                    <LayoutGrid size={14} strokeWidth={3} />
                </div>
                <span className="text-[20px] font-black uppercase  text-gray-700">
                    เลือกหมวดหมู่
                </span>
            </div>

            <div className="relative">
                {/* Scrollable Container */}
                <div className="flex gap-3 px-5 py-3 overflow-x-auto no-scrollbar scroll-smooth">
                    {categories.map((cat) => {
                        const isActive = activeCat === cat.id;

                        return (
                            <button
                                key={cat.id}
                                onClick={() => onSelect(cat.id)}
                                className={`
                                    flex items-center gap-2 px-5 py-2 rounded-2xl 
                                    text-sm font-bold whitespace-nowrap transition-all duration-300
                                    ${isActive
                                        ? "bg-orange-500 text-white shadow-[0_10px_15px_-3px_rgba(249,115,22,0.4)] ring-4 ring-orange-50"
                                        : "bg-white text-gray-500 border border-gray-200 hover:border-orange-200 hover:bg-orange-50/30"
                                    }
                                    active:scale-90
                                `}
                            >
                                {isActive && (
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-sm" />
                                )}
                                {cat.name}
                            </button>
                        );
                    })}
                </div>

                {/* Right Edge Fade - UX บอกว่ายังมีต่อ */}
                <div className="absolute right-0 top-0 bottom-0 w-14 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />
            </div>
        </div>
    );
}
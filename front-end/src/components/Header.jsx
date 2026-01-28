import { Clock, History, ShoppingCart } from "lucide-react"; // แนะนำให้ใช้ lucide-react เพื่อความสวยงาม

export default function Header({
    tableNumber,
    cartCount,
    onOpenCart,
    onOpenHistory
}) {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="flex justify-between items-center px-5 py-3 max-w-7xl mx-auto">

                {/* Left: Table Info */}
                <div className="flex flex-col">
                    <span className="text-[16px] uppercase tracking-wider text-gray-700 font-bold">เลขที่โต๊ะ</span>
                    <h1 className="text-xl font-black text-gray-800 flex items-center gap-1">
                        <span className="text-orange-500 text-2xl">#</span>
                        {tableNumber}
                    </h1>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {/* History Button: แบบเรียบหรู */}
                    <button
                        onClick={onOpenHistory}
                        className="relative p-2.5 rounded-2xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all active:scale-90"
                        title="ประวัติการสั่ง"
                    >
                        <History size={22} strokeWidth={2.5} />
                    </button>

                    {/* Cart Button: ตัวเน้นหลัก */}
                    <button
                        onClick={onOpenCart}
                        className={`
                            relative flex items-center gap-2 p-2.5 rounded-2xl transition-all active:scale-95
                            ${cartCount > 0
                                ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                                : "bg-gray-900 text-white"}
                        `}
                    >
                        <ShoppingCart size={22} strokeWidth={2.5} />

                        {cartCount > 0 && (
                            <div className="flex items-center gap-1 pr-1">
                                <div className="h-4 w-[1px] bg-white/30 mx-1" />
                                <span className="text-sm font-bold tracking-tighter">
                                    {cartCount}
                                </span>
                            </div>
                        )}

                        {/* Red Dot Notification - เฉพาะตอนมีของในตะกร้า */}
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}
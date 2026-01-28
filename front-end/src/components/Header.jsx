export default function Header({
    tableNumber,
    cartCount,
    onOpenCart,
    onOpenHistory
}) {
    return (
        <header className="sticky top-0 z-50 bg-white shadow">
            <div className="flex justify-between items-center px-4 py-3">
                <h1 className="font-bold">
                    🍽 โต๊ะ {tableNumber}
                </h1>

                <div className="flex gap-2">
                    <button
                        onClick={onOpenHistory}
                        className="px-3 py-2 rounded-full bg-gray-200"
                    >
                        📜
                    </button>

                    <button
                        onClick={onOpenCart}
                        className="relative bg-black text-white px-4 py-2 rounded-full"
                    >
                        🛒
                        {cartCount > 0 && (
                            <span className="
                                absolute -top-2 -right-2
                                bg-red-600 text-white text-xs
                                w-5 h-5 rounded-full
                                flex items-center justify-center
                            ">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}

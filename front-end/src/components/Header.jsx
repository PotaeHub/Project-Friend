import { useNavigate } from "react-router-dom";

export default function Header({ cartCount, tableNumber, onOpenCart }) {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-center px-4 py-3 bg-black text-white">
            <div className="font-semibold">
                โต๊ะ {tableNumber}
            </div>

            <div className="flex gap-4 items-center">
                <button
                    onClick={() =>
                        navigate(`/customer/history?table=${tableNumber}`)
                    }
                >
                    📜
                </button>

                <button onClick={onOpenCart} className="relative text-xl">
                    🛒
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2
                            bg-red-600 text-xs rounded-full px-2">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}

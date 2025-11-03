import { useNavigate } from "react-router-dom";

export default function Header({ cartCount, tableNumber, onOpenCart }) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
            <h1 
                className="text-xl sm:text-2xl font-bold cursor-pointer hover:scale-105 transition-transform duration-200 flex items-center gap-2 mb-4 sm:mb-0" 
                onClick={() => navigate(`/menu?table=${tableNumber}`)}
            >
                🍜 <span className="font-sans">QR Order</span>
            </h1>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                <button
                    className="w-full sm:w-auto bg-white text-orange-500 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors duration-200 flex items-center justify-center gap-2 font-medium shadow-md"
                    onClick={onOpenCart}
                >
                    🛒 <span>ตะกร้า ({cartCount})</span>
                </button>

                <button
                    className="w-full sm:w-auto bg-white text-orange-500 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors duration-200 flex items-center justify-center gap-2 font-medium shadow-md"
                    onClick={() => navigate(`/history?table=${tableNumber}`)}
                >
                    📝 <span>ประวัติ</span>
                </button>
            </div>
        </div>
    );
}
